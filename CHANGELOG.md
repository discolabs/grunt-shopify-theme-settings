# Change Log
All notable changes to this project will be documented in this file.

## Unreleased
### Added
- This new-format CHANGELOG, based on http://keepachangelog.com

## 0.4.5 - 2014-10-01
### Fixed
- Fix for a missing `temp` dependency declaration

## 0.4.4 - 2014-10-01
### Fixed
- Yet another bugfix for custom templates

## 0.4.3 - 2014-10-01
### Fixed
- Major bugfix for custom template loader

## 0.4.2 - 2014-09-29
### Fixed
- Minor template bugfix for inline labels

## 0.4.1 - 2014-09-28
### Added
- Support for repeated fields

## 0.4.0 - 2014-09-24
### Added
- Support for custom templates

## 0.3.5 - 2014-09-22
### Fixed
- Don't drop empty tags when tidying, permitting empty `<option>` tags

## 0.3.4 - 2014-09-22
### Added
- Add `default` property for text fields
- Add import for `default` property

### Fixed
- Inline labels now have `repeat` support

## 0.3.3 - 2014-08-21
### Added
- Add `hide_label` property for all fields
- Add `inline_label` property for checkboxes

## 0.3.2 - 2014-08-14
### Added
- Add support for about section
- Allow HTML in about and help blocks

## 0.3.0 - 2014-08-14
### Added
- Add support for importing and converting existing settings files

## 0.2.4 - 2014-08-09
### Fixed
- Fix issue when repeated section names had multiple spaces in them

## 0.2.3 - 2014-08-04
### Changed
- Completely rewrote README

## 0.2.2 - 2014-07-28
### Fixed
- Stop removing closing / on some elements

## 0.2.1 - 2014-07-09
### Fixed
- Fix bug with `<textarea>` elements

## 0.2.0 - 2014-07-07
### Added
- Add ability to repeat subsections
- Allow subsections to avoid displaying a title

## 0.1.2 - 2014-07-06
### Added
- Use HTMLTidy to tidy up generated HTML

### Fixed
- Fix template include path to be relative

## 0.1.0 - 2014-07-05
### Added
- Initial Grunt plugin structure
- Initial implementation of this plugin
