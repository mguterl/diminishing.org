---
layout: post
title: "require 'spec_helper'"
date: 2009-12-05 12:59
categories: ruby
---

## UPDATE 2013-04-06

The rspec command adds the spec directory on to $LOAD_PATH so this is as simple as:

{% highlight ruby %}
require 'spec_helper'
{% endhighlight %}

<hr />

This has been ranted about by others many times and I never really understood the big deal. Now I do, especially after it shaved 5 seconds off our suite of specs.

After some research I found out we were requiring our spec helpers in a “bad way.” Most of this is because of my own doing, but I thought I’d share with you guys.

There were probably 4 or 5 variations of the syntax used to require spec_helper.

{% highlight ruby %}
require File.dirname(__FILE__) + '/../spec_helper'
require File.join(File.dirname(__FILE__), '..', 'spec_helper')
require File.expand_path(File.dirname(__FILE__), + '/../spec_helper')
require File.expand_path(File.join(File.dirname(__FILE__), '..', 'spec_helper'))
{% endhighlight %}

Each of these variations existed for the different possible depths below spec, for example, spec/models, spec/models/lead, etc.

This causes ruby to attempt to load the file each time, which we really don’t want to do.

## OUTDATED

The solution is simple. See update at the top of this page.

{% highlight ruby %}
require 'spec/spec_helper'
{% endhighlight %}

This works with autospec and rake just fine and looks much better.
