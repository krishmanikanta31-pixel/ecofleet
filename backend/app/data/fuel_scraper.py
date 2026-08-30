"""
PPAC Fuel Price Scraper & Cache Pipeline
Fetches Delhi retail selling prices for Petrol and Diesel from PPAC (Petroleum Planning & Analysis Cell, Govt of India).
Includes robust caching, retry logic, and fallback mechanisms.
"""

from __future__ import annotations

import asyncio
import json
import logging
import pathlib
import re
import ssl
import urllib.error
import urllib.request
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)

CACHE_FILE = pathlib.Path(__file__).resolve().parent / "fuel_cache.json"

PPAC_URL = "https://ppac.gov.in/retail-selling-price-rsp-of-petrol-diesel-and-domestic-lpg/price-build-up-of-petrol-and-diesel"

SEED_FUEL_DATA: dict[str, Any] = {
    "petrol_price_delhi": 102.12,
    "diesel_price_delhi": 95.20,
    "currency": "INR",
    "unit": "per_litre",
    "as_of": "2026-07-31",
    "source": "PPAC (Petroleum Planning & Analysis Cell), Govt of India",
}

# In-memory cached data
_cached_data: dict[str, Any] = dict(SEED_FUEL_DATA)
_last_fetch_time: datetime | None = None


def load_cached_fuel_data() -> dict[str, Any]:
    """Load cached fuel context from disk or seed data."""
    global _cached_data
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                _cached_data = {**SEED_FUEL_DATA, **data}
                return _cached_data
        except Exception as e:
            logger.warning("Failed to load %s, using seed data: %s", CACHE_FILE, e)
    _cached_data = dict(SEED_FUEL_DATA)
    save_cached_fuel_data(_cached_data)
    return _cached_data


def save_cached_fuel_data(data: dict[str, Any]) -> None:
    """Save fuel context data to local JSON cache."""
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.warning("Failed to save fuel cache to %s: %s", CACHE_FILE, e)


def _format_date(date_str: str) -> str:
    """Standardize date strings to YYYY-MM-DD format."""
    clean = date_str.strip().replace("&nbsp;", " ")
    for fmt in ("%d-%B-%Y", "%d-%b-%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            dt = datetime.strptime(clean, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return date_str


def parse_ppac_html(html: str, current_cache: dict[str, Any]) -> dict[str, Any]:
    """
    Parse PPAC HTML content for Delhi Petrol and Diesel RSP prices and listed dates.
    Falls back gracefully to existing cache values if specific fields are not matched.
    """
    result = dict(current_cache)

    # 1. Look for Petrol RSP in Delhi
    # Example: "RSP of Petrol in Delhi as per IOCL outlet as on 31-July-2026, Rs. 102.12/ltr"
    petrol_match = re.search(
        r"RSP\s+of\s+Petrol\s+in\s+Delhi[^,\n<]*?as\s+on\s+([0-9]{1,2}-[A-Za-z]+-[0-9]{4})[,\s]+Rs\.?\s*([0-9]+\.[0-9]{2})",
        html,
        re.IGNORECASE,
    )
    if petrol_match:
        date_str, price_str = petrol_match.groups()
        result["petrol_price_delhi"] = float(price_str)
        result["as_of"] = _format_date(date_str)
    else:
        # Generic Petrol search for Delhi
        petrol_alt = re.search(
            r"Petrol[^<\n]{0,80}?Delhi[^<\n]{0,80}?Rs\.?\s*([0-9]{2,3}\.[0-9]{2})",
            html,
            re.IGNORECASE,
        )
        if petrol_alt:
            result["petrol_price_delhi"] = float(petrol_alt.group(1))

    # 2. Look for Diesel RSP in Delhi
    diesel_match = re.search(
        r"RSP\s+of\s+Diesel\s+in\s+Delhi[^,\n<]*?as\s+on\s+([0-9]{1,2}-[A-Za-z]+-[0-9]{4})[,\s]+Rs\.?\s*([0-9]+\.[0-9]{2})",
        html,
        re.IGNORECASE,
    )
    if diesel_match:
        date_str, price_str = diesel_match.groups()
        result["diesel_price_delhi"] = float(price_str)
        if not petrol_match:
            result["as_of"] = _format_date(date_str)
    else:
        diesel_alt = re.search(
            r"Diesel[^<\n]{0,80}?Delhi[^<\n]{0,80}?Rs\.?\s*([0-9]{2,3}\.[0-9]{2})",
            html,
            re.IGNORECASE,
        )
        if diesel_alt:
            result["diesel_price_delhi"] = float(diesel_alt.group(1))

    # Look for generic "as on <date>" if date wasn't extracted
    if not petrol_match and not diesel_match:
        date_alt = re.search(r"as\s+on\s+([0-9]{1,2}-[A-Za-z]+-[0-9]{4})", html, re.IGNORECASE)
        if date_alt:
            result["as_of"] = _format_date(date_alt.group(1))

    return result


def scrape_ppac_fuel_prices(
    url: str = PPAC_URL,
    timeout: float = 8.0,
    retries: int = 1,
) -> dict[str, Any]:
    """
    Scrape PPAC page with retry and timeout. Returns updated or existing cached data.
    Never raises an unhandled exception; on failure it returns the last valid cached data.
    """
    global _cached_data, _last_fetch_time

    # Ensure cache is initialized
    if not _cached_data:
        load_cached_fuel_data()

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    attempt = 0
    while attempt <= retries:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=timeout) as resp:
                if resp.status == 200:
                    html_bytes = resp.read()
                    html_text = html_bytes.decode("utf-8", errors="ignore")
                    parsed = parse_ppac_html(html_text, _cached_data)
                    _cached_data.update(parsed)
                    _last_fetch_time = datetime.now()
                    save_cached_fuel_data(_cached_data)
                    logger.info("Successfully scraped PPAC fuel prices: %s", _cached_data)
                    return _cached_data
                else:
                    logger.warning("PPAC request returned status code %s on attempt %d", resp.status, attempt + 1)
        except Exception as e:
            logger.warning("PPAC scrape attempt %d failed: %s", attempt + 1, e)

        attempt += 1

    logger.warning("All PPAC scrape attempts failed. Serving cached fuel data.")
    return _cached_data


def get_current_fuel_data() -> dict[str, Any]:
    """Get the current cached fuel context data."""
    global _cached_data
    if not _cached_data:
        return load_cached_fuel_data()
    return _cached_data


async def periodic_scrape_task(interval_seconds: int = 21600) -> None:
    """
    Periodic background loop that runs on startup and every ~6 hours (21600s).
    """
    while True:
        try:
            # Run blocking scrape in a thread to keep async loop responsive
            await asyncio.to_thread(scrape_ppac_fuel_prices)
        except Exception as e:
            logger.error("Error in periodic fuel scrape task: %s", e)

        await asyncio.sleep(interval_seconds)
