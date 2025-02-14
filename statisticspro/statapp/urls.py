from django.urls import path
from statapp.views import (UploadBusinessExcel, BusinessStatictics, AllBusinessesView, HighestRevenueCompanyView, HighestRevenueCountryView,
    SortedByRevenueView, TotalRevenueView, TotalRevenuePerCountryView,
    AverageRevenuePerCountryView, CompanyCountPerCountryView, Top5ProfitableView,
    SortedByProfitView, AverageProfitView, LowestProfitCompanyView, LowProfitView,
    LargeEmployersView, USACompaniesView, HighRevenueView, AddBusinessView
)



urlpatterns = [
    path('upload/', UploadBusinessExcel.as_view(), name= 'upload_business_excel' ),
    path('addrecord/', AddBusinessView.as_view(), name= 'add_record_business_excel'),
    path('business/stats/', BusinessStatictics.as_view(), name = 'business_stats'),
    path('queries/all_businesses/', AllBusinessesView.as_view(), name='all_businesses'),
    
    path('queries/highest_revenue_company/', HighestRevenueCompanyView.as_view(), name='highest_revenue_company'),
    path('queries/highest_revenue_country/', HighestRevenueCountryView.as_view(), name='highest_revenue_country'),
    path('queries/sorted_by_revenue/', SortedByRevenueView.as_view(), name='sorted_by_revenue'),
    path('queries/total_revenue/', TotalRevenueView.as_view(), name='total_revenue'),
    path('queries/total_revenue_per_country/', TotalRevenuePerCountryView.as_view(), name='total_revenue_per_country'),
    path('queries/average_revenue_per_country/', AverageRevenuePerCountryView.as_view(), name='average_revenue_per_country'),
    path('queries/company_count_per_country/', CompanyCountPerCountryView.as_view(), name='company_count_per_country'),
    path('queries/top_5_profitable/', Top5ProfitableView.as_view(), name='top_5_profitable'),
    path('queries/sorted_by_profit/', SortedByProfitView.as_view(), name='sorted_by_profit'),
    path('queries/average_profit/', AverageProfitView.as_view(), name='average_profit'),
    path('queries/lowest_profit_company/', LowestProfitCompanyView.as_view(), name='lowest_profit_company'),
    path('queries/low_profit/', LowProfitView.as_view(), name='low_profit'),
    path('queries/large_employers/', LargeEmployersView.as_view(), name='large_employers'),
    path('queries/usa_companies/', USACompaniesView.as_view(), name='usa_companies'),
    path('queries/high_revenue/', HighRevenueView.as_view(), name='high_revenue'),
]
