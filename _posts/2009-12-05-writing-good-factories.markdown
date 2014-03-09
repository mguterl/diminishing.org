---
layout: post
title: "Writing Good Factories"
date: 2009-12-05 12:37
categories: ruby testing
permalink: "writing-good-factories"
---

I really wanted to remember what Pratik had to say about writing good factories in his Rails Summit talk so I’m putting it up here as a reference.

## 1. Should be able to loop

{% highlight ruby %}
  10.times { Factory(:user) }
{% endhighlight %}

## 2. No associations in the base Factory

{% highlight ruby %}
  Factory(:user) and Factory(:user_with_items)
{% endhighlight %}

## 3. Should pass validations

I am thinking that rule #2 can be broken in order to achieve #3. Sometimes an object has to have a parent. I think it may be more accurate to say “No has many associations in the base Factory”, but I’m still giving it some thought.
