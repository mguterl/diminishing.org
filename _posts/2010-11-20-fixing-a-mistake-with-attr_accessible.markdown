---
layout: post
title: "Fixing a mistake with attr_accessible"
date: 2010-11-20 10:00
categories: rails
permalink: "fixing-a-mistake-with-attr_accessible"
---

It can happen to anyone, you're being a [good Rails citizen](http://news.ycombinator.com/item?id=1718438) and you have setup ActiveRecord to force the use of attr_accessible by using:

**config/initializers/attr_accessible.rb**

{% highlight ruby %}
class ActiveRecord::Base
  attr_accessible nil
end
{% endhighlight %}

Next thing you know, you add a name attribute to your user model, update the forms and other views, deploy and you're on your way.  Days go by and someone asks, why don't any of our users have names?  SHIT!  You forgot to update your the user model's attr_accessible line.

[Skip to the solution](#solution)

## Background

Something similar happened to us only days before launching [http://board.recruitmilitary.com](http://board.recruitmilitary.com).  Our support staff was setting up existing customers on our new platform and a piece of associated data they had entered during setup was missing.  I quickly realized I forgot to add the attribute to attr_accessible on the model and something had to be done.

## Possible solutions

1. Manually search through the logs attempting to perform the updates by hand.
2. Write some regular expression to parse through the logs extracting the relevant data.
3. Use an established Rails log parser to extract the revelant data.

Option #1 is just not possible, our support staff had created over 300 instances of this particular model.  While option #2 might be viable for some people, regular expressions are not my forte.

That leaves us with option #3, but I had no idea what I was looking for exactly.  Google revealed a few different options, the most interesting being [request-log-analyzer].  I had used it before, but only as it was intended for analyzing data in our production.log and mysql-slow.log.

## Solution

<a name="solution" />

It turns out that [request-log-analyzer] has many different abstractions and it's not immediately obvious how to just get a parsed representation of requests.  After some reading and experimentation I came up with this:

{% highlight ruby %}
require "request_log_analyzer"

file_format = RequestLogAnalyzer::FileFormat.load("rails", :all)
parser      = RequestLogAnalyzer::Source::LogParser.new(file_format, :source_files => ENV["SOURCE_FILES"])

parser.each_request do |request|
  if request[:controller] == "UsersController" &amp;&amp; request[:action] == "create"
    do_something request[:params]
  end
end
{% endhighlight %}

Implementing `do_something` is an exercise for the reader and will vary from case to case.  The request object is full of all kinds of information, but controller, action, and params is all you need to fix a mistake with attr_accessible.

[request-log-analyzer] is smart enough to deal with many source files and can even handle gzipped files, this comes in handy when you have many log files that being rotated via log-rotate or a similar mechanism.

## Going forward

The code in question was heavily tested, both at the unit level and integration level, however, there were no assertions that the value entered on the form was sticking.  While this is probably my fault for not validating the data was persisted in my integration test, I really dislike the silent logging behavior of attr_accessible.  In the future I think I'm going to use [trusted-params] by [Ryan Bates] of [Railscasts] fame.

[Ryan Bates]: http://twitter.com/rbates
[Railscasts]: http://railscasts.com
[trusted-params]: https://github.com/ryanb/trusted-params
[request-log-analyzer]: https://github.com/wvanbergen/request-log-analyzer
