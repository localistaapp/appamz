import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./Stats.css";


const RepeatFunnel = ({ data }) => {
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
        const widthPercent = maxValue > 0 ? (step.value / maxValue) * 100 : 0;

        // Choose color
        let bg = "#4caf50"; // green
        if (widthPercent < 70 && widthPercent >= 40) bg = "#fbc02d"; // yellow
        if (widthPercent < 40) bg = "#fb8c00"; // amber

        return (
          <div key={idx} className="funnel-row">
            <div className="funnel-bar-wrapper">
              {step.breakdown ? (
                <div
                  className="funnel-bar stacked"
                  style={{
                    width: `${widthPercent}%`,
                  }}
                >
                  <div
                    className="bar-qr"
                    style={{
                      flex: step.breakdown.qr,
                    }}
                  ></div>
                  <div
                    className="bar-direct"
                    style={{
                      flex: step.breakdown.direct,
                    }}
                  ></div>
                </div>
              ) : (
                <div
                  className="funnel-bar"
                  style={{
                    width: `${widthPercent}%`,
                    background: bg,
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

const ReferralFunnel = ({ data }) => {
  
    const funnelData = [
      { label: "Shares", value: data.SHARES || 0},
      { label: "Share Visits", value: data.SHARE_VISITS || 0 },
      { label: "Deals Claimed", value: data.SHARE_DEALS_CLAIMED || 0 },
    ];
  
    const maxValue = Math.max(...funnelData.map((d) => d.value));
  
    return (
      <div className="funnel">
        {funnelData.map((step, idx) => {
          const widthPercent = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
  
          // Choose color
          let bg = "#4caf50"; // green
          if (widthPercent < 70 && widthPercent >= 40) bg = "#fbc02d"; // yellow
          if (widthPercent < 40) bg = "#fb8c00"; // amber
  
          return (
            <div key={idx} className="funnel-row">
              <div className="funnel-bar-wrapper">
                {step.breakdown ? (
                  <div
                    className="funnel-bar stacked"
                    style={{
                      width: `${widthPercent}%`,
                    }}
                  >
                    <div
                      className="bar-qr"
                      style={{
                        flex: step.breakdown.qr,
                      }}
                    ></div>
                    <div
                      className="bar-direct"
                      style={{
                        flex: step.breakdown.direct,
                      }}
                    ></div>
                  </div>
                ) : (
                  <div
                    className="funnel-bar"
                    style={{
                      width: `${widthPercent}%`,
                      background: bg,
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

  const OnlineFunnel = ({ data }) => {
  
    const enquiries = data.ENQUIRIES || 0;
    const basketAdd = data.BASKET_ADD || 0;
    const enquiriesAdd = enquiries + basketAdd;

    const funnelData = [
        { label: "Store Browse", value: data.STORE_BROWSE || 0 },
        { label: "Enquiries + Basket Adds", value: enquiriesAdd, breakdown: { enquiries, basketAdd } },
        { label: "Re-order", value: data.RE_ORDER || 0 },
    ];
    const maxValue = Math.max(...funnelData.map((d) => d.value));
  
    return (
      <div className="funnel">
        {funnelData.map((step, idx) => {
          const widthPercent = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
  
          // Choose color
          let bg = "#4caf50"; // green
          if (widthPercent < 70 && widthPercent >= 40) bg = "#fbc02d"; // yellow
          if (widthPercent < 40) bg = "#fb8c00"; // amber
  
          return (
            <div key={idx} className="funnel-row">
              <div className="funnel-bar-wrapper">
                {step.breakdown ? (
                  <div
                    className="funnel-bar stacked"
                    style={{
                      width: `${widthPercent}%`,
                    }}
                  >
                    <div
                      className="bar-qr"
                      style={{
                        flex: step.breakdown.enquiries,
                      }}
                    ></div>
                    <div
                      className="bar-direct"
                      style={{
                        flex: step.breakdown.basketAdd,
                      }}
                    ></div>
                  </div>
                ) : (
                  <div
                    className="funnel-bar"
                    style={{
                      width: `${widthPercent}%`,
                      background: bg,
                    }}
                  ></div>
                )}
              </div>
              <div className="funnel-label">
                {step.label} — <strong>{step.value}</strong>
                {step.breakdown && (
                  <span className="breakdown">
                    {" "}
                    (Enquiries: {step.breakdown.enquiries}, Basket Adds: {step.breakdown.basketAdd})
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
    const [activeTab, setActiveTab] = useState('repeat');
    const [funnelData, setFunnelData] = useState(null);

    const loadStats = async (type) => {
        let storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;
        axios.get(`/store-stats/${storeId}/${type.toUpperCase()}`)
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

        loadStats('repeat');
    }, []);

    return (
        <div className="main">
           <div class="stats-container">
                <h1>Stats</h1>
                <div class="notif-tabs-container">
                    <div class="notif-tabs" id="notif-tabs">
                        <div onClick={()=>{setActiveTab('repeat');loadStats('repeat');}} className={`notif-tab ${activeTab == 'repeat' ? 'active' : ''}`}>Repeat</div>
                        <div onClick={()=>{setActiveTab('referral');loadStats('referral');}} className={`notif-tab ${activeTab == 'referral' ? 'active' : ''}`}>Referral</div>
                        <div onClick={()=>{setActiveTab('online');loadStats('online');}} className={`notif-tab ${activeTab == 'online' ? 'active' : ''}`}>Reorder</div>
                    </div>
                </div>
                
                {funnelData != null && activeTab == "repeat" && <><div className="funnel-headline">
                        Repeat visitor funnel:
                    </div>
                    <RepeatFunnel data={funnelData} />
                    </>
                }
                {funnelData != null && activeTab == "referral" && <><div className="funnel-headline">
                        Referral visitor funnel:
                    </div>
                    <ReferralFunnel data={funnelData} />
                    </>
                }
                {funnelData != null && activeTab == "online" && <><div className="funnel-headline">
                        Online reordering funnel:
                    </div>
                    <OnlineFunnel data={funnelData} />
                    </>
                }
                
            </div>

        </div>
    );
}

export default Stats;
