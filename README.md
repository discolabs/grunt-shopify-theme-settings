# grunt-shopify-theme-settings

> Grunt plugin to build a settings.html file for Shopify themes.



This plugin greatly simplifies the management of the `settings.html` file common to all Shopify themes. It provides:

- The declaration of desired settings in a simple, uncluttered YAML format that supports all Shopify theme input types;
- Breaking up of settings into multiple files for easier management;
- Shorthand syntax for Shopify theme setting features like help text blocks, specifying image dimensions, and to simplify the generation of repeated settings;
- Ability to create custom templates for different fields and sections of your settings files;
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
You file target should be the final `settings.html` file, with the source files being a list of YAML configuation files in the order you'd like them to appear in the final settings file.

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

If you're okay with the sections in your settings appearing in directory order, you can just use a glob to specify the input files:

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

This task accepts only a single option, `templates`, as documented below.

#### templates
Type: `Array`  
Default: `[]`

Specify a list of alternative directories to load HTML templates from if using your own custom templates.
See the section [Customising templates](#customising-templates) for more.


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

Each `.yml` file should contain one or more **Sections**, each of which can contain one or more **Subsections**.
Each of these subsections can contain in turn as many **Fields** as desired.

### Fields

Each field section corresponds to a single theme setting - a color, a text input, a file.
Aside from the text label that declares it, each field has a couple of required properties, and some optional properties, as listed below.

#### name
Type: `Text`  
Required: Yes  
Applies to: All field types

The `name` of the field should be unique across all of your settings.
It's the value that will be used for the field's name and ID attributes in the HTML, and will be the name you use to access the setting from within your Shopify templates.
For example, `name: my_field` would be accessed as `{{ settings.my_field }}` in your `.liquid` files.

#### type
Type: `Text`  
Required: Yes  
Applies to: All field types

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

If you'd like, you can create your own custom field types.
See the section [Customising templates](#customising-templates) for more.

#### help
Type: `Text`  
Required: No  
Applies to: All field types

Setting the optional `help` property will render the provided text underneath the field in the final `settings.html`.
Useful for adding instructions or clarifying image dimensions.

#### hide_label
Type: `Boolean`  
Required: No (defaults to `false`)  
Applies to: All field types

If `true`, the label rendered on the left-hand side for the settings will be hidden.
Mostly useful for `checkbox` fields with an `inline_label` set.

#### options
Type: `Hash`  
Required: No  
Applies to: `select` and `font` types only

Specifies a list of options to render in the field's `<select>` element.
The key-value pairs are provided as a hash, for example:

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

#### default
Type: `Text`  
Required: No  
Applies to: `text-single` and `text-multi` types only

Specify a default value to populate a text field with.

#### width
Type: `Integer`  
Required: No  
Applies to: `file` type only

Specify a maximum width for an uploaded file. If not specified, no limit will be applied.
See [Shopify's documentation](http://docs.shopify.com/themes/theme-development/templates/settings#input-types) for more information.

#### height
Type: `Integer`  
Required: No  
Applies to: `file` type only

Specify a maximum height for an uploaded file. If not specified, no limit will be applied.
See [Shopify's documentation](http://docs.shopify.com/themes/theme-development/templates/settings#input-types) for more information.

#### cols
Type: `Integer`  
Required: No  
Applies to: `text-multi` type only

Specify the number of columns to render for the `<textarea>` element.

#### rows
Type: `Integer`  
Required: No  
Applies to: `text-multi` type only

Specify the number of rows to render for the `<textarea>` element.

#### inline_label
Type: `Text`  
Required: No  
Applies to: `checkbox` type only

Specify a text string to be used as a label directly next to the checkbox element.

#### repeat
Type: `Array`  
Required: No  
Applies to: All field types

The `repeat` property can be used to avoid having to copy-paste the configuration for similar fields multiple times.
See [Repeating sections and fields](#repeating-sections-and-fields) for more.


#### template
Type: `Text`  
Required: No  
Applies to: All field types

If you'd like to use a custom HTML template to render your field, you can specify its name with the `template` property.
See [Customising templates](#customising-templates) for more.

---

### Subsections

Subsections are used to create subgroups of fields within a larger overall section.
All fields *must* live inside a subsection.

Beyond specifying their name, subsections have a few other optional properties.

#### notitle
Type: `Boolean`  
Required: No (defaults to `false`)  
Applies to: All subsections

Setting `notitle` as `true` on a subsection will prevent the name of that subsection being rendered in the Shopify Admin.

#### repeat
Type: `Array`  
Required: No  
Applies to: All subsections

The `repeat` property can be used to avoid having to copy-paste the configuration for similar sections multiple times.
See [Repeating sections and fields](#repeating-sections-and-fields) for more.

#### template
Type: `Text`  
Required: No  
Applies to: All subsections

As with fields, if you'd like to use a custom HTML template to render your subsection, you can specify its name with the `template` property.
See [Customising templates](#customising-templates) for more.

### Subsections example

Here's an example YAML file showing the usage of the `notitle`, `repeat` and `template` subsection properties.

```yml
My Section:
  My Subsection:
    notitle: true

    My Field:
      name: my_field
      type: text-single

  Slide {i}:
    repeat: [1, 2, 3, 4, 5]
    template: subsection-slide

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

---

### Sections

Sections correspond to the large expandable panels displayed in the Shopify Admin when viewing theme settings.
They're generally used to group related theme settings by topic (such as "Colors & Fonts") or by area of concern (such as "Footer").

Sections are the top-level object in the parsed YAML files and have only one (optional) configurable property: the template used to render them.

#### template
Type: `Text`  
Required: No  
Applies to: All sections

As with fields and subsections, you can use a custom HTML template to render your entire section, specified with the `template` property.
See [Customising templates](#customising-templates) for more.

### Special Sections

There's one special-case section: `about`, which instead of the regular Section YAML should have a `heading` and `content` properties.
These will render as a small `<div>` section, which is useful for adding credits and instructions at the top of your theme's settings file.

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


## Repeating sections and fields

It's quite common in Shopify theme setting to want to repeat particular fields, or groups of fields (sections) multiple times.
For example, many themes offer users the ability to customise a slider or carousel, which requires similar configuration (image, title, caption, et cetera) for each slide.
Here's a simple example of what we'd need to do if we wanted three slides:

```yml
---
Homepage Slider:
    
  Slide 1:
    Slide 1 Image:
      name: slide_1_image.jpg
      type: file

    Slide 1 Title:
      name: slide_1_title
      type: text-single
      
  Slide 2:
    Slide 2 Image:
      name: slide_2_image.jpg
      type: file

    Slide 2 Title:
      name: slide_2_title
      type: text-single
      
  Slide 3:
    Slide 3 Image:
      name: slide_3_image.jpg
      type: file

    Slide 3 Title:
      name: slide_3_title
      type: text-single  
```

Instead of having to copy-paste the YAML as above to configure these slides, you can simply specify the `repeat` property on the sections or fields you'd like to duplicate.
Using the `repeat` property, the above becomes:

```yml
---
Homepage Slider:
    
  Slide {i}:
    repeat: [1, 2, 3]
    
    Slide {i} Image:
      name: slide_{i}_image.jpg
      type: file

    Slide {i} Title:
      name: slide_{i}_title
      type: text-single
```

When this configuration is rendered, the specified section will be output once for each item in the `repeat` list, with any instances of the string `{i}` replaced with the list value.
You're also not just limited to integers; you can also use the `repeat` property with strings:
 
```yml
---
Navbars:
    
  {i} Navbar:
    repeat: [Top, Bottom]
    
    {i} Navbar visible?:
      name: {i}_navbar_visible
      type: checkbox

    {i} Navbar color:
      name: {i}_navbar_color
      type: color
```

When using string values like this, the string will be converted to lowercase and any whitespace will be replaced with an underscore.

Finally, if you only want to repeat a specific field a number of times, rather than an entire section of fields, you can specify the `repeat` property directly on the field itself.
This works exactly the same as with repeated sections, except that to avoid conflicts you should use the string `{f}` where you'd like the current index to be rendered.
 
This lets you use repeated sections and fields at the same time, if you'd like:
 
```yml
---
Navbars:
    
  {i} Navbar:
    repeat: [Top, Bottom]
    
    {i} Navbar visible?:
      name: {i}_navbar_visible
      type: checkbox

    {i} Navbar color:
      name: {i}_navbar_color
      type: color
      
    {i} Navbar link number {f}:
      repeat: [1, 2, 3]
      name: {i}_navbar_link_{f}
      type: text-single
``` 


## Customising templates

Sometimes, the HTML generated by the Grunt plugin isn't exactly what you're after.
You might have a fancy layout in mind, or want to render fields of a particular type in a different way.
This is possible through the use of custom HTML templates, which can be specified individually for your fields, subsections and sections.

To do this, you just need to tell the Grunt task which directory (or directories) it should search for your custom templates.
This is done through the `templates` task option.

If a directory you specify has the same name as one of the [core templates](https://github.com/discolabs/grunt-shopify-theme-settings/tree/master/tasks/templates), your custom template will take precedence.
If you'd prefer not to override an existing template, but want to use a custom template for a particular field, subsection, or section, just give your template a different name and specify it through the `template` property on the relevant field, subsection or section. 

### Example: Overriding a core template

Let's say we'd like to always render a placeholder in our rendered `<textarea>` elements.
To do this, we can override the `text-multi.html` template, which looks like this by default:

```html
<textarea id="{{ field_name}}" name="{{ field_name }}" cols="{% if field.cols %}{{ field.cols }}{% else %}60{% endif %}" rows="{% if field.rows %}{{ field.rows }}{% else %}5{% endif %}">{{ field.default }}</textarea>
```

We'll tweak it to always include a placeholder that says "Enter your text...":

```html
<textarea id="{{ field_name}}" name="{{ field_name }}" placeholder="Enter your text..." cols="{% if field.cols %}{{ field.cols }}{% else %}60{% endif %}" rows="{% if field.rows %}{{ field.rows }}{% else %}5{% endif %}">{{ field.default }}</textarea>
```

Next, let's save the modified template in to our project.
Assuming we have a `settings` directory containing the `.yml` files being used to generate our final HTML file, we can create a `templates` subdirectory and add our `text-multi.html` template, like so:   

```
.
+-- Gruntfile.js
+
+-- settings
    +-- templates
        +-- text-multi.html
    +-- section1.yml
    +-- section2.yml
    +-- section3.yml
+-- theme
    +-- ... theme files ...
```

Now we just need to tell our Grunt task to look in this directory for templates with the `templates` option:
 
```js
grunt.initConfig({
  shopify_theme_settings: {
    settings: {
      options: {
        templates: ['settings/templates']
      },
      files: {
        'theme/config/settings.html': ['settings/section1.yml', 'settings/section2.yml', 'settings/section3.yml']
      }
    }
  }
});
```

Done! Now when we run `grunt shopify_theme_settings` from the command line, our modified template should take precedence when rendering fields with the `text-multi` type.

### Example: Adding additional templates

Often, you don't want to override all uses of a template, as with the previous example.
You might want to render only one or two fields, subsections or sections differently.
To continue with the placeholder example, what would we do if we just wanted to render *some* `<textarea>` elements with a placeholder? 

To achieve this, we'd take what we've already done and just make some slight changes.
First, instead of overriding the `text-multi.html` template, we'd give it a slightly different, non-conflicting name, like `placeholder-text-multi.html`:

```
.
+-- Gruntfile.js
+
+-- settings
    +-- templates
        +-- placeholder-text-multi.html
    +-- section1.yml
    +-- section2.yml
    +-- section3.yml
+-- theme
    +-- ... theme files ...
```

We then just need to go through the `.yml` files and specify on each `text-multi` field whether we want to use a custom template:
 
```yml
My Section:
  My Subsection:

    My First Textarea:
      name: my_first_textarea
      type: text-multi
      template: placeholder-text-multi
      
    My Second Textarea:
      name: my_second_textarea
      type: text-multi
```

In the example above, the first field will be rendered using our custom `placeholder-text-multi.html` template, while the second will be rendered with the default `text-multi.html` template. 

You can create custom templates not only for fields, but for subsections and sections too.
Just remember that the best way to start with your custom templates is with a copy of the existing [core template](https://github.com/discolabs/grunt-shopify-theme-settings/tree/master/tasks/templates). 



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

* 2014-09-24   v0.4.0   Add support for custom templates.
* 2014-09-22   v0.3.5   Don't drop empty tags when tidying; permits empty `<option>` tags.
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
