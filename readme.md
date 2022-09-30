### 简单的思路 
- 获取 https://lol.qq.com/main.shtml 的网页（index.html），用cheerio提取赛程信息
- 使用node批量写入.ics日历文件

### 使用
在github上可以直接预览文件，点击ROW可以获取.ics的原始链接，IOS默认浏览器打开链接即可触发日历订阅