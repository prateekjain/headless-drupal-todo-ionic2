# headless-drupal-ionic2
Extends Headless Drupal 8 and builds a sample ToDo App in Ionic2

To make HTTP requests oniOS9 using Ionic2, following lines needs to be added in the .plist file.

Look for platforms/ios/{project_name}/{project_name}-Info.plist file and edit it -

Add the following lines in the main <dict> element

<dict>
      <key>NSAllowsArbitraryLoads</key>
      <true/>
</dict>
