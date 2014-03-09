---
layout: post
title: Extending Formtastic with a sprinkle of jQuery
date: 2010-02-19 20:45:00
categories: rails formtastic jquery
---

## Introducing Formtastic

If you’re not already using [formtastic](http://github.com/justinfrench/formtastic), you need to [check it out.](http://github.com/justinfrench/formtastic) I’ll give you a short run down of formtastic, but I suggest checking the README as it is very comprehensive. Then I’ll go on to explain how we extended formtastic with jQuery allowing us to keep our form construction code nice and simple.

When using formtastic the main method that you use for creating form elements is “input.” input takes an options hash that allows you to do all kinds of cool things. For instance you can set labels, add hints, and specify whether or not it is required.

### The almighty :as

Another great option that you can use is :as.  By setting :as you can determine what type of control a specific input should be rendered as. It is particularly useful allowing you to render has\_many and has\_and\_belongs\_to\_many relationships with either a group of check boxes or a multi-select box.

**app/models**

{% highlight ruby %}
class User < ActiveRecord::Base
  has_and_belongs_to_many :roles
end

class Role < ActiveRecord::Base
  has_and_belongs_to_many :users
end
{% endhighlight %}

Given the two models above, from the users edit screen, we may want to allow them to select roles from a list of check boxes.

**app/views/users/edit.html.erb**

{% highlight erb %}
<% semantic_form_for @user do |f| %>
  <% f.inputs do -%>
    <%= f.input :name %>
    <%= f.input :roles, :as => :check_boxes %>
    <%= f.commit_button "Update" %>
  <% end -%>
<% end %>
{% endhighlight %}

![roles check boxes](/attachments/roles_check_boxes.png)

Voila! Formtastic handles everything for you, rendering each of the roles as a check box.

Now imagine you wanted a view that listed every user in a certain role, allowing you to quickly scan and prune users who may have been incorrectly placed in a certain role. Showing a list of 100 users as check boxes may not be the best looking solution, so you can easily specify a select box. Formtastic is smart enough to even make it a multi-select.

**app/views/roles/edit.html.erb**

{% highlight erb %}
<% semantic_form_for @role do |f| %>
  <% f.inputs do -%>
    <%= f.input :title %>
    <%= f.input :users, :as => :select %>
    <%= f.commit_button "Submit" %>
  <% end -%>
<% end %>
{% endhighlight %}

![users multiselect](/attachments/users_multiselect.png)

No one likes standard multi-select boxes except lazy developers. I’ve watched my parents try and operate them and they never know what key to press when selecting. They inevitably end up using shift and selecting everything or they stop holding control and deselect everything. It sucks, it happens to me too, just less often. Now I’m giving you no excuse to use this technique if you’re using formtastic and jquery.

Extending the SemanticFormBuilder

**config/initializers/formtastic.rb**

{% highlight ruby %}
Formtastic::SemanticFormHelper.builder = Custom::SemanticFormBuilder
{% endhighlight %}

**lib/custom/semantic\_form\_builder.rb**

{% highlight ruby %}
module Custom

  class SemanticFormBuilder < Formtastic::SemanticFormBuilder

    JS_FOR_COMBOSELECT = "<script type='text/javascript'>
                            $(document).ready(function() {
                              $('#%s').comboselect();
                            });
                          </script>"

    private

    def comboselect_input(method, options)
      (JS_FOR_COMBOSELECT % "#{sanitized_object_name}_#{generate_association_input_name(method)}") << select_input(method, options)
    end

  end

end
{% endhighlight %}

jQuery comboselect plugin
You’ll also need to grab the comboselect plugin for jQuery. The .zip includes the selso plugin as a dependency for handling sorting. Check out Jason Huck’s original blog post announcing combobox for a demo and more information.

After this small amount of work you’ll be able to do:

**app/views/roles/edit.html.erb**

{% highlight erb %}
<%= f.input :users, :as => :comboselect %>
{% endhighlight %}

and you get unobtrusive, gracefully degrading, easy to use multi-select controls.

Here’s an example from RecruitMilitary that we use with some extra styling applied. You can really see how when you have a big list like the one below why something beyond standard html controls are necessary.

![combo select](/attachments/combo_select.png)
