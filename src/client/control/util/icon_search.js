var icons = require('./fa_output.js');

var fa_icon_aliases = {
	'envelope-o': ['letter', 'email'],
	'envelope': ['letter', 'email'],
	'envelope-square': ['letter', 'email']
};

function reset()
{
  if(typeof window._gaq !== 'undefined')
  {
    _gaq.push(['_trackEvent', 'Icons', 'Reset']);
  }

  // $('#search').val('');
  // $('#catagory').val('');
  // $('#release').val('');
  $('ul.icons li').show();
  $('ul.icons li').removeClass('active');
  // $('.list').removeClass('detailed');
  // $('.details').slideUp('fast');
  window.scrollTo(0, 0);
  // $('#search').focus();
}

// Search for matching icons
function find_icons(evt)
{
  // Ignore moving around in input field with arrows
  if (typeof evt !== 'undefined' && ( evt.keyCode === 27 || evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 ))
  {
    return false;
  }

  // Update GUI
  $(evt.target).next('.iconlist ul.icons').removeClass('active');

  // Fetch Search Terms
  var value = $(evt.target).val().toLowerCase();

  // Check if we have a search term
  if(value !== '')
  {
    $('ul.icons li').hide();
    $("ul.icons li[data-id*='"+value+"']").show();
    $("ul.icons li[data-aliases*='"+value+"']").show();
    $("ul.icons li[data-other*='"+value+"']").show();
  }

  // Check if the enter key was pressed, and if there was only one result
  if (typeof evt !== 'undefined' && evt.keyCode === 13) {
    if($( "ul.icons li:visible" ).length === 1)
    {
      $("ul.icons li:visible").trigger('click');
    }
  }

  return false;
}

// Render Details when Icon is selected
function render_details(data)
{
  if(typeof window._gaq !== 'undefined')
  {
    _gaq.push(['_trackEvent', 'Icons', 'Clicked', data.id]);
  }

  // Did the user click the icon that was already active
  if($("ul.icons li[data-id='"+data.id+"']").hasClass('active'))
  {
    $('ul.icons li').removeClass('active');
  }
  // Activate the selected icon
  else
  {
    $('ul.icons li').removeClass('active');

    $("ul.icons li[data-id='"+data.id+"']").addClass('active');
  }
}

// Listen for Key Presses on Body
function navigate(evt)
{
  var prev = null,
    next = null,
    escape = 27,
    left = 37,
    up = 38,
    right = 39,
    down = 40,
    active = $('ul.icons li.active'),
    tag = evt.target;

  // Exit if we're inside an input field
  if (tag === 'input' || tag === 'textarea')
  {
    return false;
  }

  // Check if nothing is selected and that we are using a known key
  if (active.length === 0 && ( evt.keyCode === left || evt.keyCode === up || evt.keyCode === right || evt.keyCode === down ))
  {
    $('ul.icons li:visible').first().trigger('click');

    if(typeof window._gaq !== 'undefined')
    {
      _gaq.push(['_trackEvent', 'Icons', 'Moved', 'Initialized']);
    }
  }
  // Something is selected so lets move around based on what key is pressed
  else
  {
    // Reset GUI
    if(evt.keyCode === escape)
    {
      reset();
    }
    // Jump one back at a time ( some might be hidden, so figure out which are visible )
    if(evt.keyCode === left)
    {
      prev = ($(active).prev(':visible').length >= 1) ? $(active).prev(':visible') : $(active).prevUntil(':visible').last().prev();
      prev.trigger('click');

      if(typeof window._gaq !== 'undefined')
      {
        _gaq.push(['_trackEvent', 'Icons', 'Moved', 'Left']);
      }
    }
    // Jump three back at a time ( some might be hidden, so figure out which are visible )
    else if(evt.keyCode === up)
    {
      var prev1 = ($(active).prev(':visible').length >= 1) ? $(active).prev(':visible') : $(active).prevUntil(':visible').last().prev();
      var prev2 = ($(prev1).prev(':visible').length >= 1) ? $(prev1).prev(':visible') : $(prev1).prevUntil(':visible').last().prev();
      var prev3 = ($(prev2).prev(':visible').length >= 1) ? $(prev2).prev(':visible') : $(prev2).prevUntil(':visible').last().prev();
      prev3.trigger('click');

      if(typeof window._gaq !== 'undefined')
      {
        _gaq.push(['_trackEvent', 'Icons', 'Moved', 'Up']);
      }
    }
    // Jump one forward at a time ( some might be hidden, so figure out which are visible )
    else if(evt.keyCode === right)
    {
      next = ($(active).next(':visible').length >= 1) ? $(active).next(':visible') : $(active).nextUntil(':visible').last().next();
      next.trigger('click');

      if(typeof window._gaq !== 'undefined')
      {
        _gaq.push(['_trackEvent', 'Icons', 'Moved', 'Right']);
      }
    }
    // Jump three forward at a time ( some might be hidden, so figure out which are visible )
    else if(evt.keyCode === down)
    {
      var next1 = ($(active).next(':visible').length >= 1) ? $(active).next(':visible') : $(active).nextUntil(':visible').last().next();
      var next2 = ($(next1).next(':visible').length >= 1) ? $(next1).next(':visible') : $(next1).nextUntil(':visible').last().next();
      var next3 = ($(next2).next(':visible').length >= 1) ? $(next2).next(':visible') : $(next2).nextUntil(':visible').last().next();
      next3.trigger('click');

      if(typeof window._gaq !== 'undefined')
      {
        _gaq.push(['_trackEvent', 'Icons', 'Moved', 'Down']);
      }
    }
  }
}
function selectText(elm)
{
  var range;
  if (document.selection)
  {
    range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(elm));
    range.select();
  }
  else if (window.getSelection)
  {
    range = document.createRange();
    range.selectNode(document.getElementById(elm));
    window.getSelection().addRange(range);
  }
}

$.fn.icon_search = function(){
	var i;
	var option;

	this.next().hide();

	function compare(a,b) {
		if (a.name.toLowerCase() < b.name.toLowerCase())
    {
      return -1;
    }
		if (a.name.toLowerCase() > b.name.toLowerCase())
    {
      return 1;
    }
		return 0;
	}

	icons.sort(compare);

	$.each(icons, function(index, value) {

		var aliases = '';
		if(value.aliases)
		{
			$.each(value.aliases, function(alias_index, alias) {
				aliases += alias;
				if((alias_index + 1) < value.aliases.length)
				{
					aliases += ', ';
				}
			});
		}
    if(value.filter)
    {
      $.each(value.filter, function(alias_index, alias) {
        aliases += alias;
        if((alias_index + 1) < value.filter.length)
        {
          aliases += ', ';
        }
      });
    }

		var other_aliases = '';
		if(fa_icon_aliases[value.id])
		{
			for(i=0; i<fa_icon_aliases[value.id].length; i++)
			{
				other_aliases += fa_icon_aliases[value.id][i];
				if((i+1) < fa_icon_aliases[value.id].length)
				{
					other_aliases += ', ';
				}
			}
		}

		var html = '<li class="btn btn-outline-primary" data-order="'+index+'" data-id="'+value.id+'" data-aliases="'+aliases+'" data-other="'+other_aliases+'" data-unicode="'+value.unicode+'">' +
			'<i class="mr-2 ' + value.class + '"></i>' +
			'<span>'+value.name+'<\/span>' +
			'<\/li>';
		$('.icons').append(html);
	});

	$('body').keyup(navigate);
	this.keyup(find_icons);
	this.focusin(function(){
		$(this).next().slideDown();
	});
	this.focusout(function(){
		$(this).next().slideUp();
	});
	this.next().find('ul.icons li').click(function(evt){
    let icon = $(this).data().id;
    $(this).parentsUntil('.iconlist').parent().prev().val(icon).trigger('icon_changed', icon);
		render_details($(this).data());
		if(typeof window._gaq !== 'undefined')
		{
		  _gaq.push(['_trackEvent', 'Icons', 'Reset']);
		}
	});
	return this;
};