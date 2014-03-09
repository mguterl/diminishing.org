---
layout: post
title: "Saving time and sanity with AppleScript"
date: 2009-05-31 12:15
categories: applescript
permalink: "saving-time-and-sanity-with-applescript"
---

Depending where I am at I have three possible monitor configurations for my MacBook.

1. External display only
2. Laptop display only
3. External and laptop display

Each time I change between these three workspaces I have to manually move the windows to the correct position for that particular configuration.  This can become extremely annoying, especially when you're as OCD as I am.  I can't even contemplate how much time I've wasted putting each window in its "perfect" position...

After many searches I came across [exactly what I was looking for.](http://www.jonathanlaliberte.com/2009/02/04/restore-previous-display-window-positions-applescript)

## Usage

1. [Download the script](/assets/home-layout.scpt)
2. Open it with Script Editor
3. Remove references to applications you aren't using
4. Save as an application with the name of the layout in the Applications fold
5. Use Spotlight to run the app

I use the same script for each layout, I just save it under a
different name.

## Problems

1. Certain applications don't seem to work (TweetDeck)
2. Applications with child windows require slightly more work (see Firefox example code)
3. The application has to be running or it errors

## TODO

1. Start the application if it is not running
2. Loop through all open applications eliminating manual configuration

## Source

{% highlight applescript %}
property numFFWindows : 0
property FFPos : {}
property FFSize : {}
property numTermWindows : 0
property TermPos : {}
property TermSize : {}
property iTunesPos : {}
property iTunesSize : {}
property EmacsPos : {}
property EmacsSize : {}
property TweetDeckPos : {}
property TweetDeckSize : {}
property iCalPos : 0
property iCalSize : 0
property AdiumContactsPos : 0
property AdiumContactsSize : 0
property AdiumIMSize : 0
property AdiumIMPos : 0
property OFPos : 0
property OFSize : 0

display dialog "Set Window Position or Save Window Position?" buttons {"Restore", "Save"} default button "Restore"
set theResult to result

tell application "System Events"
	if (button returned of theResult is "Restore") then
		-- Restore Settings
		if (numFFWindows &gt; 0) then
			tell process "Firefox"
				repeat with i from 1 to numFFWindows
					set position of window i to (item i of FFPos)
					set size of window i to (item i of FFSize)
				end repeat
			end tell
		end if
		if (numTermWindows &gt; 0) then
			tell process "Terminal"
				repeat with i from 1 to numTermWindows
					set position of window i to (item i of TermPos)
					set size of window i to (item i of TermSize)
				end repeat
			end tell
		end if
		if (iTunesPos is not {0, 0}) then
			tell process "iTunes"
				set position of window 1 to iTunesPos
				set size of window 1 to iTunesSize
			end tell
		end if
		if (EmacsPos is not {0, 0}) then
			tell process "Emacs"
				set position of window 1 to EmacsPos
				set size of window 1 to EmacsSize
			end tell
		end if
		if (iCalPos is not {0, 0}) then
			tell process "iCal"
				set position of window 1 to iCalPos
				set size of window 1 to iCalSize
			end tell
		end if
		if (OFPos is not {0, 0}) then
			tell process "OmniFocus"
				set position of window 1 to OFPos
				set size of window 1 to OFSize
			end tell
		end if
		if (AdiumContactsPos is not {0, 0}) then
			tell process "Adium"
				set position of window "Contacts" to AdiumContactsPos
				set size of window "Contacts" to AdiumContactsSize
				repeat with i from 1 to (count windows)
					if ((window i) is not (window "Contacts")) then
						set position of window i to AdiumIMPos
						set size of window i to AdiumIMSize
					end if
				end repeat

			end tell
		end if

	else
		-- Save Settings
		tell process "Firefox"
			set numFFWindows to count windows
			set FFPos to {}
			set FFSize to {}
			repeat with i from 1 to numFFWindows
				set end of FFPos to (position of window i)
				set end of FFSize to (size of window i)
			end repeat
		end tell
		tell process "Terminal"
			set numTermWindows to count windows
			set TermPos to {}
			set TermSize to {}
			repeat with i from 1 to numTermWindows
				set end of TermPos to (position of window i)
				set end of TermSize to (size of window i)
			end repeat
		end tell
		tell process "iTunes"
			set iTunesPos to position of window 1
			set iTunesSize to size of window 1
		end tell
		tell process "Emacs"
			set EmacsPos to position of window 1
			set EmacsSize to size of window 1
		end tell
		tell process "iCal"
			set iCalPos to position of window 1
			set iCalSize to size of window 1
		end tell
		tell process "OmniFocus"
			set OFPos to position of window 1
			set OFSize to size of window 1
		end tell
		tell process "Adium"
			set AdiumContactsPos to position of window "Contacts"
			set AdiumContactsSize to size of window "Contacts"
			set AdiumIMPos to {}
			set AdiumIMSize to {}
			repeat with i from 1 to (count windows)
				if ((window i) is not (window "Contacts")) then
					set AdiumIMPos to (position of window i)
					set AdiumIMSize to (size of window i)
				end if
			end repeat
		end tell
	end if
end tell
{% endhighlight %}
