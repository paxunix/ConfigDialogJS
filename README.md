ConfigDialogJS
==============

Dumb and simple HTML5 dialog JS module for config settings.

Supports radio button groups, boolean checkboxes, and single-line text
input.

Handy for Greasemonkey scripts that want to manage configuration settings.

Only provides a settings UI--managing the storage of the setting data is
still up to you.


Example
=======

```js
// Simple class to popup a modal HTML5 dialog with configurable options.
// Supports radio button groups, boolean checkboxes, single-line text
// input, and pulldown menus.

d = new ConfigDialog({
    title: "The Dialog Title",      // title is optional
    sections: [ // rendering data
        {
            section: "Section 1",   // section display names are optional
            items: [
                { type: "checkbox", display: "Option 1", key: "opt1" },
                { type: "text", display: "Opt 2", key: "opt2" },
            ]
        },
        {
            section: "Sec 2",
            items: [
                { type: "checkbox", display: "Opt 2.1", key: "opt2.1" }
            ]
        },
        {
            section: "Radio Section",
            items: [
              { type: "radiogroup", key: "optradio", items: [
                  { display: "Rad 1", value: "r1" },
                  { display: "Rad 2", value: "r2" },
                  { display: "Rad 3", value: "r3" },
              ]}
            ]
        },
        {
            section: "Pulldown Section",
            items: [
              { type: "pulldown", key: "optpd", items: [
                  { display: "Menu 1", value: "m1" },
                  { display: "Menu 2", value: "m2" },
                  { display: "Menu 3", value: "m3" },
                ]}
            ],
        }
    ]},
    {   // initial data
        opt1: true,
        opt2: "some text",
        "opt2.1": false,
        "optradio": "r2",
        "optpd": "m3",
    },
    document);

d.show()
    .then(data => { console.log("d data: ", data); })
    .catch(() => { console.log("d cancelled/aborted"); });

d2 = new ConfigDialog({ title: "Some Title", sections: [ { options: [ { display: "Thing 1", key: "thingval" } ] } ] }, {}, document);

d2.show()
    .then(data => { console.log("d2 data: ", data); })
    .catch();
```
