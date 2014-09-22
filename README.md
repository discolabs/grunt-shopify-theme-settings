# grunt-shopify-theme-settings

> Grunt plugin to build a settings.html file for Shopify themes.

This plugin greatly simplifies the management of the `settings.html` file common to all Shopify themes. It provides:

- The declaration of desired settings in a simple, uncluttered YAML format that supports all Shopify theme input types;
- Breaking up of settings into multiple files for easier management;
- Shorthand syntax for Shopify theme setting features like help text blocks, specifying image dimensions, and to simplify
  the generation of repeated settings;
- Functionality to simplify converting your existing `settings.html` to a cleaner `settings.yml`.

For more, you can [read the blog post](http://gavinballard.com/managing-shopifys-settings-html/) introducing the plugin.
For usage examples, check out the tests in this repository.


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-shopify-theme-settings --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-shopify-theme-settings');
```


## The "shopify_theme_settings" task

### Overview
In your project's Gruntfile, add a section named `shopify_theme_settings` to the data object passed into `grunt.initConfig()`.
You file target should be the final `settings.html` file, with the source files being a list of YAML configuation files in the
order you'd like them to appear in the final settings file.

```js
grunt.initConfig({
  shopify_theme_settings: {
    settings: {
      options: {},
      files: {
        'theme/config/settings.html': ['settings/section1.yml', 'settings/section2.yml']
      }
    }
  }
});
```

If you're okay with the sections in your settings appearing in directory order, you can just use a glob to specify the
input files:

```js
grunt.initConfig({
  shopify_theme_settings: {
    settings: {
      options: {},
      files: {
        'theme/config/settings.html': 'settings/*.yml'
      }
    }
  }
});
```

### Options

Currently, this task doesn't have any options.


## YAML Structure

The general format for the YAML files read by the plugin are as such:

```yaml
Section Name:
  Subsection Name:
    Field 1 Name:
      name: name_of_field_1
      type: type_of_field_1

    Field 2 Name:
      name: name_of_field_2
      type: type_of_field_2
```

Each `.yml` file should contain one or more **Sections**, each of which can contain one or more **Subsections**. Each of
these subsections can contain in turn as many **Fields** as desired.

### Fields

Each field section corresponds to a single theme setting - a color, a text input, a file. Aside from the text label
that declares it, each field has a couple of required properties, and some optional properties.

##### `name`: Text (Required)
The `name` of the field should be unique across all of your settings. It's the value that will be used for the field's
name and ID attributes in the HTML, and will be the name you use to access the setting from within your Shopify templates.
For example, `name: my_field` would be accessed as `{{ settings.my_field }}` in your `.liquid` files.

##### `type`: Text (Required)
Every field must have a `type` set. All of the input types supported by Shopify's Admin are allowed, which are:

- `text-single` (A single-line text box)
- `text-multi` (A multi-line text area)
- `select` (A dropdown select box)
- `file` (A filepicker)
- `checkbox` (A checkbox)
- `color` (A colorpicker)
- `font` (A dropdown containing a list of web-safe fonts)
- `blog` (A dropdown containing all store blogs)
- `collection` (A dropdown containing all store collections)
- `linklist` (A dropdown containing all store linklists)
- `page` (A dropdown containing all store pages)
- `snippet` (A dropdown containing all store snippets)

##### `help`: Text (Optional)
Setting the optional `help` property will render the provided text underneath the field in the final `settings.html`.
Useful for adding instructions or clarifying image dimensions.

##### `hide_label`: Boolean (Optional, defaults to `false`)
If `true`, the label rendered on the left-hand side for the settings will be hidden.
Mostly useful for `checkbox` fields with an `inline_label` set.

##### `options`: Hash (Optional, `select` and `font` types only)
Specifies a list of options to render in the field's `<select>` element. The key-value pairs are provided as a hash,
for example:

```yml
Appearance and Fonts:

  Background:

    Background Style:
      name: background_style
      type: select
      options:
        none: None
        color: Custom Color
        image: Custom Image
```

For the `font` field type, any specified options will be added to those automatically generated by Shopify.

##### `default`: Text (Optional, `text-single` and `text-multi` types only)
Specify a default value to populate a field with (note that this only works for text inputs).

##### `width`: Integer (Optional, `file` type only)
Specify a maximum width for an uploaded file. See [Shopify's documentation](http://docs.shopify.com/themes/theme-development/templates/settings#input-types) for more information.

##### `height`: Integer (Optional, `file` type only)
Specify a maximum height for an uploaded file. See [Shopify's documentation](http://docs.shopify.com/themes/theme-development/templates/settings#input-types) for more information.

##### `cols`: Integer (Optional, `text-multi` type only)
Specify the number of columns to render for the `<textarea>` element.

##### `rows`: Integer (Optional, `text-multi` type only)
Specify the number of rows to render for the `<textarea>` element.

##### `inline_label`: Text (Optional, `checkbox` type only)
Specify a text string to be used as a label directly next to the checkbox element.

### Subsections

Subsections are used to create subgroups of fields within a larger overall section. Currently, all fields *must* live
inside a subsection.

Beyond their name, you can declare two other interesting properties on subsections: `notitle` and `repeat`.

##### `notitle`: Boolean (Optional)
Setting `notitle` as `true` on a subsection will prevent the name of the subsection being rendered in the Shopify Admin.

##### `repeat`: Array (Optional)
The `repeat` property can be used to avoid having to copy-paste the same fields multiple times. This is common in theme
settings, for example when providing users with fields to customise a home page slider. You may want to allow users to
upload up to five slides, with an optional title and caption for each slide. Instead of copy-pasting the required fields
three times, the `repeat` property allows you to just specify a list of index values and the corresponding fields will
be rendered in the final `settings.html`.

For example, setting `repeat: [1, 2, 3]` will render all fields in the repeated section three times, with "index" values
of `1`, `2` and `3`. You can also use strings, for example `repeat: [Top, Middle, Bottom]`.

When using the `repeat` property, the names and labels of the repeated field objects should contain the string `{i}`,
which will be replaced with the current index for each iteration. See the example below and in the tests for examples.

Here's an example YAML file showing the usage of both `notitle` and `repeat`.

```yml
My Section:
  My Subsection:
    notitle: true

    My Field:
      name: my_field
      type: text-single

  Slide {i}:
    repeat: [1, 2, 3, 4, 5]

    Slide {i} Image:
      name: slide_{i}_image.jpg
      type: file

    Slide {i} Title:
      name: slide_{i}_title
      type: text-single

    Slide {i} Caption:
      name: slide_{i}_caption
      type: text-multi
```

### Sections

Sections correspond to the large expandable panels displayed in the Shopify Admin when viewing theme settings. They're
generally used to group related theme settings by topic (such as "Colors & Fonts") or by area of concern (such as "Footer").

Sections are the top-level object in the parsed YAML files and have no attributes beyond their name.

There's one special-case section name: `about`, which instead of the regular Section YAML should have a `heading` and
`content` properties. These will render as a small `<div>` section, which is useful for adding credits and instructions
at the top of your theme's settings file.

Here's an example, using the YAML's pipe (`|`) syntax for multi-line strings:

```yml
---
about:
  heading: Theme by <a href="http://gavinballard.com">Gavin Ballard</a>
  content: |
    <p>Welcome to this theme!</p>
    <p>Get support <a href="mailto:gavin@gavinballard.com">here</a>.</p>

Main Section:
...remaining YAML...
```


## Converting existing settings files

To make the transition to using this plugin easier, this plugin includes an import/export task that reads your existing
`settings.html` file and does its best to convert it to a `settings.yml` file suitable for the `shopify_theme_settings`
task.

To convert your old settings, just run the following command from your Grunt directory:

```shell
grunt shopify_import_theme_settings --importFile=/path/to/settings.html --exportFile=/path/to/settings.yml
```

The import tool will detect your setting file's inputs, sections and headings as best it can, but note that due to the
wide variety of possible markup, it may miss some non-standard layouts. If you're having trouble importing your
`settings.html` correctly, please [raise an issue](https://github.com/discolabs/grunt-shopify-theme-settings/issues).

The conversion tool also outputs all of your settings into one `.yml` file - you might want to split it up into multiple
sections to improve manageability.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 2014-09-22   v0.3.4   Add `default` attribute.
* 2014-08-21   v0.3.3   Add `hide_label` and `inline_label` attributes.
* 2014-08-15   v0.3.2   Minor improvements.
* 2014-08-14   v0.3.0   Add settings importer.
* 2014-08-09   v0.2.4   Bugfixes.
* 2014-08-04   v0.2.3   README update.
* 2014-07-28   v0.2.2   Bugfixes.
* 2014-07-09   v0.2.1   Bugfixes.
* 2014-07-07   v0.2.0   New features (subsection repeat, titleless subsection).
* 2014-07-06   v0.1.2   Bugfixes.
* 2014-07-05   v0.1.0   Initial release.

---

Task submitted by [Gavin Ballard](http://gavinballard.com)
