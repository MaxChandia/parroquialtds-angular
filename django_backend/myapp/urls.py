# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Login
    path('login/', views.login_view, name='login'), # Make sure you have this line in your main project urls.py if not here

    # Noticias: listado/creación (GET / POST)
    path('noticias/', views.posts_view, name='posts_view'),

    # Noticias: detalle/actualización/eliminación (GET / PUT / DELETE)
    path('noticias/<str:slug>/', views.post_detail_view, name='post_detail_view'),
]