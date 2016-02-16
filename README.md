# headless-drupal-todo-ionic2
Extends Headless Drupal 8 and builds a sample ToDo App in Ionic2

<b> Installing Ionic </b>

Refer this URL - http://ionicframework.com/docs/v2/getting-started/installation/


<b>Things to note</b>

<u>Running app on iOS</u>

```
$ ionic platform add ios
```

After adding iOS platform and to make HTTP requests oniOS9 using Ionic2, following lines needs to be added in the .plist file.

Look for platforms/ios/{project_name}/{project_name}-Info.plist file and edit it -

Add the following lines in the main ```<dict>``` element
```
<dict>
      <key>NSAllowsArbitraryLoads</key>
      <true/>
</dict>
```
