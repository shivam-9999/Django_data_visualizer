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
from collections import OrderedDict



# Add Business Entry API (POST)
class AddBusinessView(APIView):
    def post(self, request):
        serializer = BusinessSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        data = Business.objects.all().order_by("-revenue").values()
        return Response(data)


class HighestRevenueCountryView(APIView):
    def get(self, request):
        try:
            data = (
                Business.objects.values("country")
                .annotate(total_revenue_by_country=Sum("revenue"))
                .order_by("-total_revenue_by_country")
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
            data = list(Business.objects.order_by("-revenue").values("name","revenue"))
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
            # Fetch all records ordered by profit
            records = Business.objects.order_by("-profit").values("name", "profit")

            # Ensure only unique companies
            unique_companies = []
            seen_companies = set()

            for record in records:
                company = record["name"]
                if company not in seen_companies:
                    seen_companies.add(company)
                    unique_companies.append(record)
                if len(unique_companies) == 5:  # Stop when we have 5 unique companies
                    break
            data = list(unique_companies)
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
            data = list(Business.objects.filter(profit__lt=threshold).order_by("profit").values("ID","name","revenue"))
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LargeEmployersView(APIView):
    def get(self, request):
        try:
            threshold = 50  # Adjust as needed
            
            # Aggregate employees per company
            queryset = (
                Business.objects.filter(employees__gt=threshold)
                .values("name", "country")  # Group by company name and country
                .annotate(total_employees=Sum("employees"))  # Sum employees
                .order_by("-total_employees")  # Sort by highest employees
            )
            
            data = list(queryset)

            if not data:
                return Response({"error": "No data found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class USACompaniesView(APIView):
    def get(self, request):
        try:
            data = list(Business.objects.filter(country__iexact="USA").order_by('-revenue').values())
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