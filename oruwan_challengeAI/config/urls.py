from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('oruwanaccount.urls')),
    #re_path(".*", TemplateView.as_view(template_name="index.html")),
    path('blog/', include('blog.urls')),
    path('challenge/', include('challenge.urls')),
    path('routine/', include('routine.urls')),
    path('mypage/', include('mypage.urls')),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    
#urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)