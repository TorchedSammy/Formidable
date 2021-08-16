# Formidable
> A lewd Discord media sorting maid.

<img src="https://static.wikia.nocookie.net/bhlx/images/6/69/Formidable.png/revision/latest?cb=20190911161945">

Formidable is a highly convenient "sorting maid," which allows you to upload an image or doujins
once to multiple categorized channels in a Discord server. She also keeps you updated on doujinshi with a
channel feed.

## Features
- nhentai feed
  - She will post new nhentai doujinshi in a single dedicated channel, and also allow you to
  add them to your sorted collection.

### Planned
- Edit and delete entries
  - From specific categories/tags (perhaps you have something you dont like as much anymore and want to move it from god tier -> decent)
- Discord reader
  - Be able to read any supported doujinshi source from Discord via a reader cmmand
- Download doujinshi
  - Post a single zip of all pages of supported doujinshi sources.

# Setup
1. Install Node.js (I develop on v14.17.0, but v12 should work?)
2. Once installed, clone the GitHub repo:
```
git clone https://github.com/TorchedSammy/Formidable
cd Formidable
```
3. Install dependencies
```
npm i
```
4. And run!
```
node .
```

**Note:** Certain channel IDs are hardcoded (at the moment), so if you're self hosting,
you're gonna have to change those.

# License
[BSD 3-Clause.](LICENSE)

