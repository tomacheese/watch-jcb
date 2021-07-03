# preg_match("<input id=\"jsonData\" name=\"jsonData\" value=\"(.+)\" type=\"hidden\" />", $html, $m);
import json
from datetime import datetime, timezone
from pprint import pprint

import requests
from bs4 import BeautifulSoup

from src import logger, load_notified_ids, send_to_discord, config, add_notified_id


def main():
    response = requests.get("https://www.jcb.co.jp/campaign/")
    response.raise_for_status()
    response.encoding = response.apparent_encoding

    soup = BeautifulSoup(response.text, "html.parser")
    jsonData = soup.find("input", {"id": "jsonData"})
    if jsonData is None:
        logger.critical("jsonData is not found.")
        exit(1)

    notified_ids = load_notified_ids()
    isFirst = len(notified_ids) == 0

    result = json.loads(jsonData.get("value"))
    for info in result["campaignObject"][1]["campaignList"][0]["campaignInfo"]:
        eventCode = info["eventCode"]
        if eventCode in notified_ids:
            continue

        campaignName = info["campaignName"]
        descriptionText = info["descriptionText"]
        entryNeedFlag = info["entryNeedFlag"]
        detailPageURL = info["detailPageURL"]
        campaignStartDate = info["campaignStartDate"]
        campaignStartDate = campaignStartDate[0:4] + "/" + campaignStartDate[4:6] + "/" + campaignStartDate[6:8]
        campaignEndDate = info["campaignEndDate"]
        campaignEndDate = campaignEndDate[0:4] + "/" + campaignEndDate[4:6] + "/" + campaignEndDate[6:8]

        logger.info(campaignName, descriptionText, entryNeedFlag, detailPageURL, campaignStartDate, campaignEndDate)

        embed = {
            "title": campaignName,
            "description": descriptionText,
            "url": detailPageURL,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "color": 0xff8000,
            "fields": [
                {
                    "name": "期間",
                    "value": campaignStartDate + " ～ " + campaignEndDate
                },
                {
                    "name": "参加登録が必要",
                    "value": entryNeedFlag
                }
            ]
        }

        if not isFirst:
            send_to_discord(
                config.DISCORD_TOKEN,
                config.DISCORD_CHANNEL_ID,
                "",
                embed
            )

        add_notified_id(eventCode)


if __name__ == "__main__":
    main()
