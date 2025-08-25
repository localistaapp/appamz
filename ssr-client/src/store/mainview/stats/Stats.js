import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./Stats.css";

const Funnel = ({ data }) => {
  const qr = data.QR_VISITS || 0;
  const direct = data.DIRECT_VISITS || 0;
  const qrDirect = qr + direct;

  const funnelData = [
    { label: "QR + Direct Visits", value: qrDirect, breakdown: { qr, direct } },
    { label: "Deals Claimed", value: data.DEALS_CLAIMED || 0 },
    { label: "Repeat Visits", value: data.REPEAT_VISITS || 0 },
  ];

  const maxValue = Math.max(...funnelData.map((d) => d.value));

  return (
    <div className="funnel">
      {funnelData.map((step, idx) => {
        const widthPercent =
          maxValue > 0 ? (step.value / maxValue) * 100 : 0;

        return (
          <div key={idx} className="funnel-row">
            <div className="funnel-bar-wrapper">
              {step.breakdown ? (
                <div
                  className="funnel-bar stacked"
                  style={{ width: `${widthPercent}%` }}
                >
                  <div
                    className="bar-qr"
                    style={{ flex: step.breakdown.qr }}
                  ></div>
                  <div
                    className="bar-direct"
                    style={{ flex: step.breakdown.direct }}
                  ></div>
                </div>
              ) : (
                <div
                  className="funnel-bar single"
                  style={{
                    width: `${widthPercent}%`,
                    background: step.value > 6 ? "#4caf50" : step.value > 3 ? "#fbc02d" : "#fb8c00"
                  }}
                ></div>
              )}
            </div>

            <div className="funnel-label">
              {step.label} — <strong>{step.value}</strong>
              {step.breakdown && (
                <span className="breakdown">
                  {" "}
                  (QR: {step.breakdown.qr}, Direct: {step.breakdown.direct})
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};


const Stats = ({url}) => {
    const [qrVisits, setQRVists] = useState(0);
    const [directsVisits, setDirectsVisits] = useState(0);
    const [dealsClaimed, setDealsClaimed] = useState(0);
    const [repeatVisits, setRepeatVisits] = useState(0);
    const [funnelData, setFunnelData] = useState(null);

    const loadStats = async () => {
        let storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;
        axios.get(`/store-stats/${storeId}`)
            .then(function (response) {
                if(response.data != 'auth error') {
                    console.log('--res--', JSON.stringify(response.data));
                    const result = response.data.reduce((acc, item) => {
                        acc[item.metric] = Number(item.value); // convert string to number
                        return acc;
                      }, {});
                      
                    setFunnelData(result);
                    setQRVists(result['QR_VISITS']);
                    setDirectsVisits(result['DIRECT_VISITS']);
                    setDealsClaimed(result['DEALS_CLAIMED']);
                    setRepeatVisits(result['REPEAT_VISITS']);
                }
            }.bind(this));
    }

    useEffect(() => {
        const tabs = document.getElementById('notif-tabs');
        const tabElements = document.querySelectorAll('.notif-tab');

        tabElements.forEach(tab => {
            tab.addEventListener('click', () => {
                tabElements.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        loadStats();
    }, []);

    return (
        <div className="main">
           <div class="container">
                <h1>Stats</h1>
                <div class="notif-tabs-container">
                    <div class="notif-tabs" id="notif-tabs">
                        <div class="notif-tab active">Repeat</div>
                        <div class="notif-tab">Referral</div>
                        <div class="notif-tab">Online Orders</div>
                    </div>
                </div>

                {funnelData != null && <Funnel data={funnelData} />}

                <div className="festive">
                {qrVisits > 0 && 
                    <div className="notif-item">
                        {qrVisits}
                    </div>
                }
                {directsVisits > 0 && 
                    <div className="notif-item">
                        {directsVisits}
                    </div>
                }
                {dealsClaimed > 0 && 
                    <div className="notif-item">
                        {dealsClaimed}
                    </div>
                }
                {repeatVisits > 0 && 
                    <div className="notif-item">
                        {repeatVisits}
                    </div>
                }
                </div>
                
                
            </div>

        </div>
    );
}

export default Stats;
