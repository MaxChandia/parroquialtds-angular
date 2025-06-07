from django.urls import path
from . import views

urlpatterns = [

    path('login/', views.login_view, name='login'),
    path('noticias/', views.posts_view, name='posts_view'),
    path('noticias/<str:slug>/', views.post_detail_view, name='post_detail_view'),
]