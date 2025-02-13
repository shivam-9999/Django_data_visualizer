from django.db import DatabaseError
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework. response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Business
from .serializers import BusinessSerializer
from django.db.models import Sum, Avg, Count, Max
import pandas as pd
import numpy as np


# UploadBusinessExcel
class UploadBusinessExcel(APIView):
    def post(self, request):
        
        # go and get the excel file 
        excel_file = request.FILES['office']
        # read the excel file 
        df = pd.read_excel(excel_file)
        
        # iterate rows
        for _, row in df.iterrows():
            Business.objects.create(
                name = row['name'],
                revenue = row['revenue'],
                profit = row['profit'],
                employees = row['employees'], 
                country = row['country']
            )
            
        return Response({'message : Business Data Uploaded'})
    
# BusinessStatictics  
class BusinessStatictics (APIView):
	def get (self, request) :
		business_data=Business.objects.values_list( 'revenue', 'profit','employees')  
		np_data=np.array(business_data)
		stats={
			'mean' :np. mean (np_data,axis=1).tolist(),
			'std_dev': np.std(np_data,axis=1).tolist(),
			'min': np.min(np_data, axis=1). tolist(),
		}
		return Response(stats)

# business Queries 
class AllBusinessesView(APIView):
    def get(self, request):
        data = Business.objects.all().values()
        return Response(data)


class HighestRevenueCountryView(APIView):
    def get(self, request):
        try:
            data = (
                Business.objects.values("country")
                .annotate(total_revenue=Sum("revenue"))
                .order_by("-total_revenue")
            ).first()

            if not data:
                return Response({"message": "No data available"}, status=status.HTTP_404_NOT_FOUND)

            return Response(data)
        except DatabaseError:
            return Response({"error": "Database error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HighestRevenueCompanyView(APIView):
    def get(self, request):
        try:
            # Find the highest revenue value
            highest_revenue = Business.objects.aggregate(Max("revenue"))["revenue__max"]

            if highest_revenue is None:
                return Response(
                    {"message": "No business records found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Fetch the company that has the highest revenue
            business = Business.objects.filter(revenue=highest_revenue).first()

            if business:
                # Serialize and return business details
                data = BusinessSerializer(business).data
            else:
                data = {"message": "No business records found"}

            return Response(data, status=status.HTTP_200_OK)
        except DatabaseError:
            return Response(
                {"error": "Database error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        

class SortedByRevenueView(APIView):
    def get(self, request):
        try:
            data = list(Business.objects.order_by("-revenue").values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TotalRevenueView(APIView):
    def get(self, request):
        try:
            total_revenue = Business.objects.aggregate(Sum("revenue"))["revenue__sum"] or 0
            return Response({"total_revenue": total_revenue})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TotalRevenuePerCountryView(APIView):
    def get(self, request):
        try:
            data = list(
                Business.objects.values("country")
                .annotate(total_revenue_by_country=Sum("revenue"))
                .order_by("-total_revenue_by_country")
            )
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AverageRevenuePerCountryView(APIView):
    def get(self, request):
        try:
            data = list(
                Business.objects.values("country")
                .annotate(average_revenue=Avg("revenue"))
                .order_by("-average_revenue")
            )
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CompanyCountPerCountryView(APIView):
    def get(self, request):
        try:
            data = list(
                Business.objects.values("country")
                .annotate(company_count_per_country=Count("id"))
                .order_by("-company_count_per_country")
            )
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Top5ProfitableView(APIView):
    def get(self, request):
        try:
            data = list(Business.objects.order_by("-profit")[:5].values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SortedByProfitView(APIView):
    def get(self, request):
        try:
            data = list(Business.objects.order_by("-profit").values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AverageProfitView(APIView):
    def get(self, request):
        try:
            avg_profit = Business.objects.aggregate(Avg("profit"))["profit__avg"] or 0
            return Response({"average_profit": avg_profit})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LowestProfitCompanyView(APIView):
    def get(self, request):
        try:
            business = Business.objects.order_by("profit").first()
            if business:
                data = BusinessSerializer(business).data
            else:
                data = {"message": "No business records found"}
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LowProfitView(APIView):
    def get(self, request):
        try:
            threshold = 100000  # Adjust as needed
            data = list(Business.objects.filter(profit__lt=threshold).values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LargeEmployersView(APIView):
    def get(self, request):
        try:
            threshold = 50  # Adjust as needed
            data = list(Business.objects.filter(employees__gt=threshold).values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class USACompaniesView(APIView):
    def get(self, request):
        try:
            data = list(Business.objects.filter(country__iexact="USA").values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HighRevenueView(APIView):
    def get(self, request):
        try:
            threshold = 500000  # Adjust as needed
            data = list(Business.objects.filter(revenue__gt=threshold).order_by('-revenue').values())
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)