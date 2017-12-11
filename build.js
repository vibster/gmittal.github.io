/*
* 2017 Gautam Mittal
*/

var fs = require('fs');
var marked = require('marked');
var moment = require('moment');

marked.setOptions({ gfm: true, tables: true,
    highlight: function (code) {
        return require(`highlight.js`).highlightAuto(code).value;
    }
});

let ls = (dir) => {
    return fs.readdirSync(`${__dirname}/${dir}`).filter((f) => {
        return f.substr(0, 1) != `.`;
    });
}

let extract = (contentDir, postFileName) => {
    const fileContent = fs.readFileSync(`${contentDir}/${postFileName}`, `utf-8`)
    const start = fileContent.indexOf(`---START_METADATA---`);
    const end = fileContent.indexOf(`---END_METADATA---`);
    const jsonStart = fileContent.substr(start, end).indexOf(`{`);
    return {
        'slug': postFileName.substr(11, postFileName.length-14),
        'timestamp': moment(postFileName.substr(0, 10), [`YYYY-MM-DD`]).format(`LL`),
        'metadata': JSON.parse(fileContent.substr(jsonStart, end-jsonStart)),
        'content': fileContent.substr(end+`---END_METADATA---`.length, fileContent.length)
    }
}

let compile = (contentDir) => {
    let postListMarkup = [];

    // Process each post
    ls(contentDir).forEach((post) => {
        const metadata = extract(contentDir, post).metadata;

        // Build list of posts displayed on the homepage
        const listTemplate = `<div class="story">
            <a href="/${extract(contentDir, post).slug}.html">${metadata.title}</a>
            <span class="date">${extract(contentDir, post).timestamp}. ${metadata.summary}</span></div>`;
        postListMarkup.unshift(listTemplate);

        // Build individual posts from template
        marked(extract(contentDir, post).content, function (err, content) {
            if (err) throw err;
            const postTemplate = fs.readFileSync(`${__dirname}/templates/post.html`, `utf-8`)
                                   .replace(/{POST-TITLE}/g, metadata.title)
                                   .replace(/{POST-DATE}/g, extract(contentDir, post).timestamp)
                                   .replace(/{POST-AUTHOR}/g, metadata.author)
                                   .replace(/{POST-READ-TIME}/g, Math.ceil(content.split(` `).length / 200))
                                   .replace(/{POST-CONTENT}/g, content);
            // Write to disk
            fs.writeFileSync(`${__dirname}/${extract(contentDir, post).slug}.html`, postTemplate);
        });
    });

    // Build home page
    const indexTemplate = fs.readFileSync(`${__dirname}/templates/index.html`, `utf-8`)
                            .replace(/{BLOG-POST-LIST}/g, postListMarkup.join(``));
    fs.writeFileSync(`${__dirname}/index.html`, indexTemplate);
}


// Yesterday is history, tomorrow is a mystery, but today is a gift.
compile(`content`);