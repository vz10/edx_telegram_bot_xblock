# -*- coding: utf-8 -*-

from django import forms
from django.forms.widgets import NumberInput
from django.utils.translation import ugettext_lazy as _


class BotXBlockForm(forms.Form):
    passing_grade = forms.FloatField(label=_(u"Passing grade for that xblock"),
                                     help_text=_(u"Put here minimal grade to pass this xblock"),
                                     min_value=0,
                                     widget=NumberInput(attrs={'step': '0.1'}))
