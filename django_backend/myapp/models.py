from djongo import models

class User(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=100, db_column='user')
    password = models.CharField(max_length=100, db_column='password')
    

    class Meta:
        db_table = 'User'

    def __str__(self):
        return self.username

class Post(models.Model):
    _id = models.ObjectIdField()
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    imageUrls = models.JSONField(
        blank=True,
        null=True,
        default=list 
    )
    createdAt = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = 'Post'

    def __str__(self):
        return self.title