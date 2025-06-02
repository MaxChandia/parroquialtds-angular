from djongo import models

class User(models.Model):
    # Asume que tu colección se llama 'User'
    _id = models.ObjectIdField()
    # Mapea el campo 'user' de MongoDB a 'username' en Django
    username = models.CharField(max_length=100, db_column='user')
    # Mapea el campo 'password' de MongoDB a 'password' en Django
    password = models.CharField(max_length=100, db_column='password') # Considera que Django Auth usa hashes
    # Agrega otros campos si los tienes en MongoDB, con db_column si es necesario

    class Meta:
        db_table = 'User' # Asegúrate de que esto coincida con el nombre de tu colección

    def __str__(self):
        return self.username

class Post(models.Model):
    # Asume que tu colección se llama 'Post'
    _id = models.ObjectIdField()
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    imageUrls = models.JSONField(blank=True, null=True) # O models.ArrayField si es una lista de Strings
    createdAt = models.DateTimeField(auto_now_add=True)

    # Mapea la relación 'authorId' de MongoDB a 'author' en Django
    # Usa db_column para el nombre del campo en MongoDB
    # `db_column='authorId'` indica que el campo en MongoDB se llama authorId
    # `db_ref='User'` para que Djongo sepa que es una referencia a la colección User

    class Meta:
        db_table = 'Post' # Asegúrate de que esto coincida con el nombre de tu colección

    def __str__(self):
        return self.title