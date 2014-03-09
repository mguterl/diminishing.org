---
layout: post
title: "runit and delayed_job"
date: 2010-01-16 19:40
categories: delayed_job runit
permalink: "runit-and-delayed-job"
---

## Back story

We've been using [Collective Idea's fork of Delayed Job](http://collectiveidea.com/) at [RecruitMilitary](http://recruitmilitary.com) for quite some time now. We've processed over 2 million jobs and we're extremely reliant on it for the day-to-day operation of our site.

For a long time the compelling reason behind us using Collective Idea's fork of delayed\_job was the built in support for daemonization. This functionality is added via the daemons gem, however, it is not without [problems](http://github.com/collectiveidea/delayed_job/issues#issue/3). We use monit to kill memory hungry workers and have frequently experienced issues with workers not stopping, deleting their pid file, and another duplicate worker ends up starting. Before you know it, your server is freaking out because there are 4 times the number of workers running than you want.

Everyone has their own [solutions](http://github.com/collectiveidea/delayed_job/issues#issue/3) too. [One of which](http://github.com/ghazel/daemons) was working for us for a while, but suddenly started experiencing the same issues. At this point I'm completely irritated, I have to monitor the server and kill off stray workers a few times per day. We considered moving to [Resque](http://github.com/defunkt/resque), but we weren't ready to change such a critical piece of our infrastructure.

And then I came across [runit](http://smarden.org/runit/). A few weeks back I had asked [Tobias Lütke](http://twitter.com/tobi) about daemonizing clarity and he said they use runit. Tobi is also the original author of [Delayed Job](http://github.com/tobi/delayed_job), so when I started having all of these problems I [asked](http://twitter.com/mguterl/status/7758427613) how he managed daemonizing workers. ["we use runit for everything. It's so much better."](http://twitter.com/tobi/status/7758674554)

> runit is a cross-platform Unix init scheme with service supervision, a replacement for sysvinit, and other init schemes. It runs on GNU/Linux, BSD, MacOSX, Solaris, and can easily be adapted to other Unix operating systems.

This intrigued me, however, I was not interested in replacing my init scheme. Luckily ubuntu provides two separate packages runit (doesn't replace init) and runit-run (replaces init)/ runit-services. We'll be just using runit.

## Configuring runit and delayed_job

{% highlight bash %}
sudo apt-get install runit
{% endhighlight %}

With the help of some [runit configuration files from Rick Olson](https://gist.github.com/4e9ccc9f9b27d91d323b) we moved our worker infrastructure to runit. Documentation for getting all of this setup is sparse, so I hope this can help someone else.

Services are configured in /etc/sv so we create a directory for each worker that we want to run /etc/sv/rm-dj-1 .. rm-dj-n. Inside of each directory create a file named “run” that resembles this:

{% highlight bash %}
#!/bin/sh
set -e
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
APP_ROOT=/home/deploy/public_html/rm/current
cd $APP_ROOT

exec 2>&1
exec chpst -u deploy:deploy -e /etc/service/rm-dj-1/env rake jobs:work
{% endhighlight %}

Notice that we are just running a rake task, that does not go into the background. When you build services for runit, you have to make sure that it does not background itself, runit handles all of that for you. If the process dies for any reason runit will bring it back up almost instantly. It also handles all of the process id (pid) management for you too.

chpst is a useful tool included with runit, in this case it changes the user from root to deploy and evaluates the files in /etc/service/rm-dj-1/env as environment variables. I just need to set MIN\_PRIORITY and RAILS\_ENV with some simple below:

{% highlight bash %}
echo '0' >/etc/sv/rm-dj-1/env/MIN_PRIORITY
echo 'production' > /etc/sv/rm-dj-1/RAILS_ENV
{% endhighlight %}

Currently the workers are just logging to stdout, I need to configure them to log to RAILS_ROOT/log/delayed_job.log again, but it's not extremely important at the moment. Anyways, runit provides [svlogd](http://smarden.org/runit/svlogd.8.html) for handling streams of output. I really don't know much about what is going on here, but I'll figure it out some day.

In /etc/sv/rm-dj-n/log create a file named “run” that resembles this:

{% highlight bash %}
#!/bin/sh
set -e
exec svlogd ./main
{% endhighlight %}

Make sure you create the /etc/sv/rm-dj-n/main directory or it won't be able to write the data there. Also, be sure to start runsvdir if it is not started already. At this point your first worker should be fully configured and you can make runit aware by symlinking it to the service directory.

{% highlight bash %}
sudo ln -s /etc/sv/rm-dj-1 /etc/service/
{% endhighlight %}

As soon as runsvdir picks up the new directory it will fire up your worker and its manager process “runsv rm-dj-1.”

### ps logging

runit has a really useful feature for debugging. you can simply run:

{% highlight bash %}
ps -ef | grep runsvdir
{% endhighlight %}

and see any errors. If there are no errors you will just see a series of dots.

## runit and monit

We use monit to handle workers with out of control memory usage. Monit used to be in charge of restarting dead workers too, but runit is much faster at detecting this and typically restarts the process before monit even notices. Monit will notice and report that the pid for that entry changed.

    check process rm_dj_worker_1
      with pidfile /etc/sv/rm-dj-1/supervise/pid
      start program = "/usr/bin/sv up rm-dj-1" as uid root and gid root with timeout 3000 seconds
      stop program = "/usr/bin/sv down rm-dj-1" as uid root and gid root with timeout 3000 seconds
      group delayed_job
      if totalmem > 175 Mb then restart
      if changed pid then restart
      if 3 restarts within 5 cycles then timeout

## The Future

There is [talk on the mailing list](http://groups.google.com/group/delayed_job/browse_thread/thread/304b7940e0d68bec) about a [Unicorn](http://unicorn.bogomips.org/) style pre-forking worker model. I will be extremely happy once this is merged in. We've been using Unicorn for the last couple months and it has been amazing!

[Full Configuration](http://gist.github.com/279082)
