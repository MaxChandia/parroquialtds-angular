# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_all_users, name='get_all_users'),
    path('posts/', views.get_all_posts, name='get_all_posts'),
    path('posts/<str:slug>/', views.get_single_post, name='get_single_post'),
]