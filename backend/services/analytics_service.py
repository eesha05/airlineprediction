import numpy as np
import pandas as pd
from backend.services.ml_service import get_dataset, get_metrics

def get_overview_data():
    df = get_dataset()
    total = len(df)
    satisfied = int((df['satisfaction'] == 'satisfied').sum())
    neutral_dissat = int((df['satisfaction'] == 'neutral or dissatisfied').sum())
    sat_rate = round((satisfied / total) * 100, 2) if total > 0 else 0.0

    metrics = get_metrics()
    test_accuracy = round(metrics['accuracy'] * 100, 2)

    # Satisfaction donut
    sat_donut = [
        {"name": "Satisfied", "value": satisfied, "color": "#10b981"},
        {"name": "Neutral or Dissatisfied", "value": neutral_dissat, "color": "#f43f5e"}
    ]

    # Age histogram (binned)
    bins = [0, 20, 30, 40, 50, 60, 70, 100]
    labels = ["<20", "20-29", "30-39", "40-49", "50-59", "60-69", "70+"]
    df_temp = df.copy()
    df_temp['Age_Group'] = pd.cut(df_temp['Age'], bins=bins, labels=labels, right=False)
    age_hist = df_temp['Age_Group'].value_counts().reindex(labels).fillna(0).reset_index()
    age_hist.columns = ['range', 'count']
    age_hist_data = age_hist.to_dict(orient='records')

    # Travel class chart
    class_counts = df['Class'].value_counts().reset_index()
    class_counts.columns = ['name', 'value']
    class_data = class_counts.to_dict(orient='records')

    # Customer type chart
    cust_counts = df['Customer Type'].value_counts().reset_index()
    cust_counts.columns = ['name', 'value']
    cust_data = cust_counts.to_dict(orient='records')

    # Satisfaction by class
    sat_by_class = pd.crosstab(df['Class'], df['satisfaction']).reset_index()
    sat_by_class_data = []
    for _, row in sat_by_class.iterrows():
        sat_by_class_data.append({
            "class": row['Class'],
            "satisfied": int(row.get('satisfied', 0)),
            "neutral_dissatisfied": int(row.get('neutral or dissatisfied', 0))
        })

    # Average service ratings (top 6 for overview)
    service_cols = [
        'Inflight wifi service', 'Online boarding', 'Seat comfort',
        'Inflight entertainment', 'Cleanliness', 'On-board service'
    ]
    avg_ratings = []
    for col in service_cols:
        avg_ratings.append({
            "service": col,
            "rating": round(float(df[col].mean()), 2)
        })

    return {
        "kpis": {
            "total_passengers": total,
            "satisfied_passengers": satisfied,
            "neutral_dissatisfied_passengers": neutral_dissat,
            "satisfaction_rate": sat_rate,
            "model_test_accuracy": test_accuracy,
            "dataset_scope": "Sampled Dataset (10,000 records)"
        },
        "satisfaction_donut": sat_donut,
        "age_histogram": age_hist_data,
        "class_distribution": class_data,
        "customer_distribution": cust_data,
        "satisfaction_by_class": sat_by_class_data,
        "average_ratings": avg_ratings
    }

def get_demographics_data(gender=None, customer_type=None, age_min=0, age_max=100):
    df = get_dataset()
    if gender:
        df = df[df['Gender'] == gender]
    if customer_type:
        df = df[df['Customer Type'] == customer_type]
    df = df[(df['Age'] >= age_min) & (df['Age'] <= age_max)]

    # Gender distribution
    gender_counts = df['Gender'].value_counts().reset_index()
    gender_counts.columns = ['name', 'value']

    # Customer type distribution
    cust_counts = df['Customer Type'].value_counts().reset_index()
    cust_counts.columns = ['name', 'value']

    # Age histogram
    bins = [0, 20, 30, 40, 50, 60, 70, 100]
    labels = ["<20", "20-29", "30-39", "40-49", "50-59", "60-69", "70+"]
    df_temp = df.copy()
    df_temp['Age_Group'] = pd.cut(df_temp['Age'], bins=bins, labels=labels, right=False)
    age_hist = df_temp['Age_Group'].value_counts().reindex(labels).fillna(0).reset_index()
    age_hist.columns = ['age_group', 'count']

    # Gender vs Satisfaction
    g_sat = pd.crosstab(df['Gender'], df['satisfaction']).reset_index()
    gender_sat_data = []
    for _, row in g_sat.iterrows():
        gender_sat_data.append({
            "gender": row['Gender'],
            "satisfied": int(row.get('satisfied', 0)),
            "neutral_dissatisfied": int(row.get('neutral or dissatisfied', 0))
        })

    # Customer Type vs Satisfaction
    c_sat = pd.crosstab(df['Customer Type'], df['satisfaction'], normalize='index') * 100
    c_sat = c_sat.reset_index()
    cust_sat_data = []
    for _, row in c_sat.iterrows():
        cust_sat_data.append({
            "customer_type": row['Customer Type'],
            "satisfied": round(float(row.get('satisfied', 0)), 1),
            "neutral_dissatisfied": round(float(row.get('neutral or dissatisfied', 0)), 1)
        })

    # Age vs satisfaction box stats
    age_sat_stats = {}
    for sat_val in ['satisfied', 'neutral or dissatisfied']:
        sub = df[df['satisfaction'] == sat_val]['Age'].dropna()
        if len(sub) > 0:
            age_sat_stats[sat_val] = {
                "min": float(sub.min()),
                "q1": float(sub.quantile(0.25)),
                "median": float(sub.median()),
                "q3": float(sub.quantile(0.75)),
                "max": float(sub.max()),
                "mean": round(float(sub.mean()), 1)
            }

    return {
        "gender_distribution": gender_counts.to_dict(orient='records'),
        "customer_distribution": cust_counts.to_dict(orient='records'),
        "age_distribution": age_hist.to_dict(orient='records'),
        "gender_vs_satisfaction": gender_sat_data,
        "customer_vs_satisfaction": cust_sat_data,
        "age_vs_satisfaction_box": age_sat_stats
    }

def get_travel_data(travel_class=None, travel_purpose=None):
    df = get_dataset()
    if travel_class:
        df = df[df['Class'] == travel_class]
    if travel_purpose:
        df = df[df['Type of Travel'] == travel_purpose]

    # Travel class
    class_dist = df['Class'].value_counts().reset_index()
    class_dist.columns = ['name', 'value']

    # Business vs Personal
    type_dist = df['Type of Travel'].value_counts().reset_index()
    type_dist.columns = ['name', 'value']

    # Flight distance histogram
    dist_bins = [0, 500, 1000, 1500, 2000, 3000, 5000]
    dist_labels = ["<500", "500-999", "1000-1499", "1500-1999", "2000-2999", "3000+"]
    df_temp = df.copy()
    df_temp['Dist_Group'] = pd.cut(df_temp['Flight Distance'], bins=dist_bins, labels=dist_labels, right=False)
    dist_hist = df_temp['Dist_Group'].value_counts().reindex(dist_labels).fillna(0).reset_index()
    dist_hist.columns = ['distance_range', 'count']

    # Satisfaction by travel purpose
    sat_purpose = pd.crosstab(df['Type of Travel'], df['satisfaction']).reset_index()
    sat_purpose_data = []
    for _, row in sat_purpose.iterrows():
        sat_purpose_data.append({
            "type_of_travel": row['Type of Travel'],
            "satisfied": int(row.get('satisfied', 0)),
            "neutral_dissatisfied": int(row.get('neutral or dissatisfied', 0))
        })

    # Average delays by satisfaction
    delay_stats = df.groupby('satisfaction')[['Departure Delay in Minutes', 'Arrival Delay in Minutes']].mean().reset_index()
    delay_stats_data = []
    for _, row in delay_stats.iterrows():
        delay_stats_data.append({
            "satisfaction": row['satisfaction'],
            "avg_departure_delay": round(float(row['Departure Delay in Minutes']), 1),
            "avg_arrival_delay": round(float(row['Arrival Delay in Minutes']), 1)
        })

    return {
        "class_distribution": class_dist.to_dict(orient='records'),
        "purpose_distribution": type_dist.to_dict(orient='records'),
        "distance_distribution": dist_hist.to_dict(orient='records'),
        "satisfaction_by_purpose": sat_purpose_data,
        "delays_by_satisfaction": delay_stats_data
    }

def get_services_data():
    df = get_dataset()
    service_cols = [
        'Inflight wifi service', 'Departure/Arrival time convenient',
        'Ease of Online booking', 'Gate location', 'Food and drink',
        'Online boarding', 'Seat comfort', 'Inflight entertainment',
        'On-board service', 'Leg room service', 'Baggage handling',
        'Checkin service', 'Inflight service', 'Cleanliness'
    ]

    # Average rating across all services
    overall_avg = []
    for col in service_cols:
        overall_avg.append({
            "service": col,
            "average_rating": round(float(df[col].mean()), 2)
        })
    overall_avg.sort(key=lambda x: x['average_rating'], reverse=True)

    # Ratings split by satisfaction
    by_sat = df.groupby('satisfaction')[service_cols].mean().T.reset_index()
    by_sat.columns = ['service', 'neutral_dissatisfied', 'satisfied']
    by_sat['neutral_dissatisfied'] = by_sat['neutral_dissatisfied'].round(2)
    by_sat['satisfied'] = by_sat['satisfied'].round(2)
    by_sat['gap'] = (by_sat['satisfied'] - by_sat['neutral_dissatisfied']).round(2)
    by_sat_sorted = by_sat.sort_values(by='gap', ascending=False)

    largest_gaps = by_sat_sorted[['service', 'satisfied', 'neutral_dissatisfied', 'gap']].head(5).to_dict(orient='records')

    return {
        "all_service_ratings": overall_avg,
        "ratings_by_satisfaction": by_sat.to_dict(orient='records'),
        "top_rated": overall_avg[:3],
        "bottom_rated": overall_avg[-3:],
        "largest_satisfaction_gaps": largest_gaps
    }

def get_satisfaction_analysis_data():
    df = get_dataset()
    
    # Class breakdown
    class_sat = pd.crosstab(df['Class'], df['satisfaction'], normalize='index') * 100
    class_sat_data = [{"class": k, "satisfied": round(float(v.get('satisfied', 0)), 1), "neutral_dissatisfied": round(float(v.get('neutral or dissatisfied', 0)), 1)} for k, v in class_sat.to_dict(orient='index').items()]

    # Numerical correlation matrix
    num_cols = [
        'Flight Distance', 'Inflight wifi service', 'Ease of Online booking',
        'Online boarding', 'Seat comfort', 'Inflight entertainment',
        'On-board service', 'Leg room service', 'Cleanliness', 'Departure Delay in Minutes'
    ]
    corr_matrix = df[num_cols].corr().round(2)
    
    corr_data = []
    for i, col1 in enumerate(num_cols):
        for j, col2 in enumerate(num_cols):
            corr_data.append({
                "x": col1,
                "y": col2,
                "value": float(corr_matrix.loc[col1, col2])
            })

    return {
        "satisfaction_by_class": class_sat_data,
        "correlation_matrix": {
            "columns": num_cols,
            "values": corr_data
        }
    }
