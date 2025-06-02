# myapp/views.py
from django.http import JsonResponse
from .models import User, Post

def get_all_users(request):
    users_data = []
    for user in User.objects.all():
        users_data.append({
            'id': str(user._id), 
            'username': user.username,
            'password': user.password
        })
    return JsonResponse(users_data, safe=False)

def get_single_post(request, slug):
    try:
        post = Post.objects.get(slug=slug)
        post_data = {
            'id': str(post._id),
            'title': post.title,
            'slug': post.slug,
            'content': post.content,
            'imageUrls': post.imageUrls,
            'createdAt': post.createdAt.isoformat(),
        }
        return JsonResponse(post_data)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    
def get_all_posts(request):
    posts_data = []
    for post in Post.objects.all():
        posts_data.append({
            'id': str(post._id),
            'title': post.title,
            'slug': post.slug,
            'content': post.content,
            'imageUrls': post.imageUrls,
            'createdAt': post.createdAt.isoformat(),
        })
    return JsonResponse(posts_data, safe=False)