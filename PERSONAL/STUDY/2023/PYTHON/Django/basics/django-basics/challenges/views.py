from django.shortcuts import render
from django.http import Http404, HttpResponseNotFound, HttpResponseRedirect
from django.urls import reverse
from django.template.loader import render_to_string

# Create your views here.
monthly_challenges_list = {
    "january": "Eat no more chocolate",
    "february": "Walk for at least 30 minutes",
    "march": "Do not eat any food that contains nuts",
    "april": "Learn Django for at least 30 minutes everyday",
    "may": "Eat no meat for the entire month",
    "june": "Complete at least one challenge",
    "july": "Make at least one new friend",
    "august": "Join at least one new club",
    "september": "Play at least one sport",
    "october": "Be at least one hour late to work",
    "november": "Sleep at least 8 hours",
    "december": None,
}


def index(request):
    list_items = ""
    months = list(monthly_challenges_list.keys())

    # for month in months:
    #     cap_month = month.capitalize()
    #     month_path = reverse("month-challenge", args=[month])
    #     list_items += f"<li><a href=\"{month_path}\">{cap_month}</a></li>"
    # response_data = "<ul>" + list_items + "</ul>"
    return render(request, "challenges/index.html", {"months": months})


def monthly_challenge_by_number(request, month):
    months = list(monthly_challenges_list.keys())
    if month > len(months):
        return HttpResponseNotFound("<h1>Page not found</h1>")
    else:
        forward_month = months[month - 1]
        redirect_path = reverse("month-challenge", args=[forward_month])
        # return HttpResponseRedirect("/challenges/{}".format(forward_month))
        return HttpResponseRedirect(redirect_path)


def monthly_challenges(request, month):
    try:
        challenge_text = monthly_challenges_list[month]
        return render(request, "challenges/challenge.html", {
            "text": challenge_text,
            "month": month.capitalize(),
        })
    except:
        # response_data = render_to_string("404.html")
        # return HttpResponseNotFound(response_data)
        raise Http404()
