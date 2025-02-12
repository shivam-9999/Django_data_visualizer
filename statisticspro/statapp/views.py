from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework. response import Response
from rest_framework import status
from django. shortcuts import get_object_or_404
from .models import Business
from .serializers import BusinessSerializer
import pandas as pd
import numpy as np


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
