from fake_useragent import UserAgent
import urllib.parse as urlprs
import requests
import json
import argparse
import clipboard
import re

parser = argparse.ArgumentParser()
parser.add_argument("-c", "--cookies", help="update cookies for URL: https://pan.baidu.com")
parser.add_argument("-l", "--link", help="generate direct link from input")
parser.add_argument("-f", "--frame", help="generate a simple framework from input")
args = parser.parse_args()
if args.cookies:
    with open('cookies', 'wb') as writer:
        writer.write(args.cookies.encode("utf-8"))
elif args.link or args.frame:
    with open('cookies', 'rb') as reader:
        cookies_raw = reader.read().decode("utf-8")
    cookies = {}
    for items in cookies_raw.split(';'):
        items = items.strip()
        index = items.index('=')
        cookies[items[:index]] = items[index + 1:]
    data = args.link if args.link else args.frame
    url = ""
    name = ""
    kind = ""
    if data.startswith("http"):
        url = data
        tmp = re.findall(re.compile(r'target=%5B%22([^&]+)%22%5D'), data)[0]
        name = urlprs.unquote(tmp)
    elif data.startswith("/"):
        name = data
        url = "https://pan.baidu.com/api/filemetas?target=" + urlprs.quote('["' + data + '"]') + \
        "&dlink=1&channel=chunlei&web=1&app_id=250528&bdstoken=2f935ef7d1ed3cf8d11b9a6" + \
        "c0f1ca4f7&logid=MTU2Nzk0NTk3Njc5ODAuMzI5ODk5NDE1MDM0OTk3Mg==&clienttype=0";
    kind = name[name.rindex('.') + 1:].upper()
    res = requests.get(url, cookies=cookies)
    obj = json.loads(res.text)
    dlink = obj['info'][0]['dlink']
    ua = UserAgent()
    headers = {'User-Agent': ua.random}
    res = requests.head(dlink, headers=headers, cookies=cookies)
    text = res.headers['Location']
    print("name:", name)
    print("type:", kind)
    tip = "link" if args.link else "script"
    if args.frame:
        if kind == "MP4":
            text = "<video preload='auto' id='linked_video' src=''" + text + \
            "webkit-playsinline='true' playsinline='true' x-webkit-airplay='true'" + \
            "x5-video-player-type='h5' x5-video-player-fullscreen='true' " + \
            "controls='controls' x5-video-ignore-metadata='true'></video>"
        elif kind == "MP3":
            text = "<audio id='linked_music' controls='controls'><source src='" + text + \
            "' type='audio/mp3' /></audio>"
        elif kind in ["JPG", "PNG"]:
            text = "<img id='linked_picture' src='" + text + "' />"
    clipboard.copy(text)
    print("** The %s below has been copy to the clipboard **" % tip)
    print(text)