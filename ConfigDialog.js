"use strict";


const OKAY_TEXT = "Ok";
const CANCEL_TEXT = "Cancel";
const STYLE_ID = "ConfigDialog_style";
const OPT_CLASS = "opt";


class ConfigDialog
{
    constructor(config, initialState, doc)
    {
        this.config = config;

        this.dialog = doc.createElement("dialog");
        this.dialog.classList.add(STYLE_ID);
        this.dialog.style = "text-align: left;";

        this.setDialogState(initialState);

        // Set in show()
        this.onOkay = null;
        this.onCancel = null;

        // Called regardless of how the dialog was closed, so no need for
        // separate cancel event handler.
        this.dialog.addEventListener("close", evt => {
            if (this.dialog.returnValue === OKAY_TEXT)
                return this.onOkay();

            return this.onCancel();
        });

        // Only add style to document head if it's not already there (same
        // styling is shared by all ConfigDialogs).
        if (!doc.head.querySelector(`style#${STYLE_ID}`))
            doc.head.appendChild(this.getCssStyleNode(doc));

        doc.body.appendChild(this.dialog);
    }


    // from http://2ality.com/2015/01/template-strings-html.html
    static htmlEscape(str)
    {
        return str.replace(/&/g, '&amp;') // first!
              .replace(/>/g, '&gt;')
              .replace(/</g, '&lt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
              .replace(/`/g, '&#96;');
    }


    static renderCheckbox(option, state)
    {
        let key = ConfigDialog.htmlEscape(option.key);
        let displayName = ConfigDialog.htmlEscape(option.display);

        return `<label><input class="${OPT_CLASS}" type="checkbox" name="${key}" ${state[option.key] ? "checked" : ""}/>${displayName}</label>`;
    }


    static renderInput(option, state)
    {
        let key = ConfigDialog.htmlEscape(option.key);
        let displayName = ConfigDialog.htmlEscape(option.display);

        return `<label>${displayName} <input class="${OPT_CLASS}" type="text" name="${key}" value="${ConfigDialog.htmlEscape(state[option.key] || "")}"}/></label>`;
    }


    static renderRadio(option, state)
    {
        let key = ConfigDialog.htmlEscape(option.key);
        let displayName = ConfigDialog.htmlEscape(option.display);

        return `<label><input class="${OPT_CLASS}" type="radio" name="${key}" ${state[option.key] === option.value ? "checked" : ""} value="${ConfigDialog.htmlEscape(option.value)}"/>${displayName}</label>`;
    }


    static renderOption(option, state)
    {
        // Note that the state's data (not the rendering input) determines
        // the option type.
        let keyType = typeof(state[option.key]);
        let hasValue = option.hasOwnProperty("value");

        if (hasValue)
            return ConfigDialog.renderRadio(option, state);

        if (keyType === "boolean")
            return ConfigDialog.renderCheckbox(option, state);

        return ConfigDialog.renderInput(option, state);
    }


    static renderSection(sectionData, state)
    {
        let displayName = sectionData.display ?
            `<legend>${ConfigDialog.htmlEscape(sectionData.display)}</legend>` :
            "";
        let markup = [ `<fieldset style="margin-bottom: 1.5ex;">${displayName}` ];

        for (let opt of sectionData.options)
        {
            markup.push(`<div style="margin-bottom: 1ex;">${ConfigDialog.renderOption(opt, state)}</div>`);
        }

        markup.push("</fieldset>");

        return markup.join("\n");
    }


    static renderTitle(title)
    {
        return `<div style="background-color: #1783ca; font-weight: bold; font-size: 12pt; padding: 0.5ex; margin-bottom: 1.5ex; text-align: center;">${ConfigDialog.htmlEscape(title)}</div>`;
    }


    getCssStyleNode(doc)
    {
        let style = doc.createElement("style");

        style.id = STYLE_ID;
        style.textContent = `
dialog.${STYLE_ID}::backdrop {
    background: linear-gradient(45deg, rgba(6,33,47,0.82), rgba(84,157,195,0.82));
}
`;

        return style;
    }


    getMarkup(newState)
    {
        let markup = [
            "<div>",
            this.config.title ? ConfigDialog.renderTitle(this.config.title) : "",
            "<form method='dialog' style='height: 100%;'>",
        ];

        for (let sect of this.config.sections)
        {
            markup.push(ConfigDialog.renderSection(sect, newState));
        }

        markup.push(`
<div style="display: flex; justify-content: space-evenly;">
<input type="submit" style="width: 5em;" value="${OKAY_TEXT}" />
<input type="submit" style="width: 5em;" value="${CANCEL_TEXT}" />
</div>
`);
        markup.push("</form>", "</div>");

        return markup.join("\n");
    }


    show()
    {
        let oldState = this.getDialogState();

        return new Promise((res, rej) => {
            this.onOkay = () => {
                return res(this.getDialogState());
            };

            this.onCancel = () => {
                this.setDialogState(oldState);
                rej();
            };

            // Ensure state is cleared before displaying, since this is set
            // by canceling the dialog with Esc or via form interactions.
            this.dialog.returnValue = undefined;
            this.dialog.showModal();
        });
    }


    getDialogState()
    {
        let state = {};

        for (let el of this.dialog.querySelectorAll(`.${OPT_CLASS}`))
        {
            switch (el.type)
            {
                case "checkbox":
                    state[el.name] = el.checked;
                    break;

                case "text":
                    state[el.name] = el.value;
                    break;

                case "radio":
                    if (el.checked)
                        state[el.name] = el.value;

                    break;

                default:
                    break;
            }
        }

        return state;
    }


    setDialogState(newState)
    {
        this.dialog.innerHTML = this.getMarkup(newState);
    }
};

export default ConfigDialog;
