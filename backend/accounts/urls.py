from django.urls import path
from . import views

urlpatterns = [
    path('password/request-code/', views.request_code),
    path('password/verify-code/', views.verify_code),
    path('password/reset/', views.reset_password),
]