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
import "ConfigDialogJS";

d = new ConfigDialog({
    title: "The Dialog Title",      // title is optional
    sections: [ // rendering data
        {
            display: "Section 1",   // section display names are optional
            options: [
                { display: "Option 1", key: "opt1" },
                { display: "Opt 2", key: "opt2" },
            ]
        },
        {
            display: "Sec 2",
            options: [
                { display: "Opt 2.1", key: "opt2.1" }
            ]
        },
        {
            display: "Radio Section",
            options: [
                // If an option has a value, it will be rendered as a radio
                // button.  You will want the key for each radio button to
                // be the same for that given grouping (which does not
                // strictly have to be contained within a single section).
                { display: "Rad 1", key: "optradio", value: "r1" },
                { display: "Rad 2", key: "optradio", value: "r2" },
                { display: "Rad 3", key: "optradio", value: "r3" },
            ]
        },
    ]},
    {   // initial data
        opt1: true,
        opt2: "some text",
        "opt2.1": false,
        "optradio": "r2",
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