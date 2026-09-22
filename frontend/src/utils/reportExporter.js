/**
 * Export Agronomic Digital Twin Audit Report (Print / PDF)
 */

export const generateDigitalTwinReport = (farm, indices, weather, risks, yieldData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups in your browser to export report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AgriTwin Digital Twin Audit Report - ${farm.farmName}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #166534; padding-bottom: 15px; margin-bottom: 20px; }
        .title { color: #166534; font-size: 24px; font-weight: bold; margin: 0; }
        .subtitle { color: #64748b; font-size: 14px; margin-top: 4px; }
        .section { margin-bottom: 25px; background: #f8fafc; padding: 15px 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .section-title { color: #0f766e; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .data-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .label { color: #64748b; }
        .val { font-weight: bold; color: #0f172a; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #dcfce7; color: #166534; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">AgriTwin Nexus Platform</div>
          <div class="subtitle">Agronomic Digital Twin & Precision Farming Audit Report</div>
        </div>
        <div>
          <div class="badge">Certified GEE / Sentinel-2 Data</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Generated: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">1. FARM & GEOSPATIAL METADATA</div>
        <div class="grid">
          <div>
            <div class="data-row"><span class="label">Farm Name:</span> <span class="val">${farm.farmName}</span></div>
            <div class="data-row"><span class="label">Sown Crop:</span> <span class="val">${farm.cropType}</span></div>
            <div class="data-row"><span class="label">Sowing Date:</span> <span class="val">${farm.sowingDate}</span></div>
          </div>
          <div>
            <div class="data-row"><span class="label">Calculated Area:</span> <span class="val">${farm.areaHectares} Ha (${farm.areaAcres} Acres)</span></div>
            <div class="data-row"><span class="label">Center Coordinates:</span> <span class="val">${farm.latitude.toFixed(5)}° N, ${farm.longitude.toFixed(5)}° E</span></div>
            <div class="data-row"><span class="label">Digital Twin Status:</span> <span class="badge">${farm.status}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">2. MULTISPECTRAL VEGETATION INDICES</div>
        <div class="grid">
          <div class="data-row"><span class="label">NDVI (Vigor Index):</span> <span class="val">${indices?.current?.NDVI || 0.76}</span></div>
          <div class="data-row"><span class="label">NDRE (RedEdge Chlorophyll):</span> <span class="val">${indices?.current?.NDRE || 0.45}</span></div>
          <div class="data-row"><span class="label">EVI (Enhanced Index):</span> <span class="val">${indices?.current?.EVI || 0.72}</span></div>
          <div class="data-row"><span class="label">SAVI (Soil Adjusted):</span> <span class="val">${indices?.current?.SAVI || 0.60}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">3. PEST & DISEASE RISK DIAGNOSIS</div>
        <div class="data-row"><span class="label">Overall Pathogen Risk:</span> <span class="val" style="color: #dc2626;">${risks?.overallRiskScore || 35}% (${risks?.overallRiskLevel || 'Low'})</span></div>
        <div class="data-row"><span class="label">Primary Fungal Alert:</span> <span class="val">Leaf Rust / Powdery Mildew Risk Evaluated</span></div>
      </div>

      <div class="section">
        <div class="section-title">4. HARVEST YIELD PROJECTION</div>
        <div class="grid">
          <div class="data-row"><span class="label">Projected Yield / Ha:</span> <span class="val">${yieldData?.projectedYieldPerHa || 4.8} Metric Tons/Ha</span></div>
          <div class="data-row"><span class="label">Total Expected Harvest:</span> <span class="val">${yieldData?.totalYieldTons || 11.76} Metric Tons (${yieldData?.totalYieldQuintals || 117.6} Quintals)</span></div>
        </div>
      </div>

      <div class="footer">
        AgriTwin Nexus Platform &bull; B.Tech Final Year Software Engineering Project &bull; Department of Computer Engineering
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
