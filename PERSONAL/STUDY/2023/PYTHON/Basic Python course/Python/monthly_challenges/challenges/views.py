from django.shortcuts import render
from django.http import HttpResponseNotFound, HttpResponseRedirect, Http404
from django.urls import reverse

monthly_challenges = {
    "january": "Walk for at least 20 minutes every day!",
    "february": "Eat at least 5 fruits and vegetables every day!",
    "march": "Learn Django for at least 20 minutes every day!",
    "april": "Walk for at least 20 minutes every day!",
    "may": "Eat at least 5 fruits and vegetables every day!",
    "june": "Learn Django for at least 20 minutes every day!",
    "july": "Walk for at least 20 minutes every day!",
    "august": "Eat at least 5 fruits and vegetables every day!",
    "september": "Learn Django for at least 20 minutes every day!",
    "october": "Walk for at least 20 minutes every day!",
    "november": "Eat at least 5 fruits and vegetables every day!",
    "december": None,
}


def index(request):
    months = list(monthly_challenges.keys())
    return render(request, "challenges/index.html", {
        "months": months,
    })


def monthly_challenge_by_number(request, month):
    months = list(monthly_challenges.keys())
    if month > len(months):
        raise Http404()
    redirect_month = months[month - 1]
    redirect_path = reverse("month-challenge", args=[redirect_month])
    return HttpResponseRedirect(redirect_path)


# Create your views here.
def monthly_challenge(request, month):
    try:
        challenge_text = monthly_challenges[month]
        return render(request, "challenges/challenge.html", {
            "challenge": challenge_text,
            "month": month,
        })
    except:
        raise Http404()
