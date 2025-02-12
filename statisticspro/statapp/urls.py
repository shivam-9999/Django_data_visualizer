from django.urls import path
from statapp.views import UploadBusinessExcel, BusinessStatictics


urlpatterns = [
    path('upload/', UploadBusinessExcel.as_view(), name= 'upload_business_excel' ),
    path('business/stats/', BusinessStatictics.as_view(), name = 'business_stats')
]
