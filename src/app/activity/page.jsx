// components/Activity.js
'use client'
import { useState, useEffect } from 'react';
import Modal from '../_components/_activity/Modal';
import RefundTransaction from '../_components/_activity/RefundTransaction';
import Sidebar from "../_components/_shift/sidebar";
import SendReceiptModal from '../_components/_activity/SendReceiptModal';
import { format, isToday, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showSendReceiptModal, setShowSendReceiptModal] = useState(false);
  const [selectedStatus, setSelectedStatus ] = useState(null)
  const { data: session, status } = useSession(); //getSession
  const [ userId, setUserId ] = useState(null);

  useEffect(() => {
    if (session && session.user) {
      setUserId(parseInt(session.user.id));
    }
  }, [session]);

  useEffect(() => {
    async function fetchActivities() {
      const response = await fetch('/api/activities');
      const data = await response.json();
      setActivities(data);
    }

    fetchActivities();
  }, []);

  const handleClick = async (activity) => {
    const response = await fetch(`/api/activities/${activity.id}`);
    const data = await response.json();
    setSelectedStatus(activity.status)
    setSelectedActivity(data);
  };

  // Function to group activities by date and month
  const groupActivitiesByDate = (activities) => {
    const grouped = activities.reduce((acc, activity) => {
      const date = parseISO(activity.transaction_date);
      const dayOfWeek = format(date, 'EEEE'); // Get day of the week
      const monthYear = format(date, 'MMMM yyyy');
      const dayLabel = `${dayOfWeek}, ${format(date, 'MMMM yyyy')}`;
      const isTodayActivity = isToday(date);

      if (isTodayActivity) {
        if (!acc['Today']) acc['Today'] = [];
        acc['Today'].push(activity);
      } else {
        if (!acc[monthYear]) acc[monthYear] = {};
        if (!acc[monthYear][dayLabel]) acc[monthYear][dayLabel] = [];

        acc[monthYear][dayLabel].push(activity);
      }

      return acc;
    }, {});

    return grouped;
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="flex p-4 pl-14">
      {/* Sidebar */}
      <Sidebar />

      {/* Activity Section */}
      <div className="w-1/2 p-4 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Activity</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Receipt or Invoice Number..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button className="absolute right-2 top-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a4 4 0 11-8 0 4 4 0 018 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 19l-3.5-3.5"
              />
            </svg>
          </button>
        </div>
        <div>
          {/* Display "Today" activities */}
          {groupedActivities['Today'] && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 bg-slate-700 text-white p-2">Today</h3>
              {groupedActivities['Today'].map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => handleClick(activity)}
                  className={`cursor-pointer bg-white p-4 mb-4 border-l-4 ${
                    activity.status === 'CANCELED' ? 'border-red-500' : 'border-blue-500'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">{activity.amount}</span>
                    <span
                      className={`text-sm ${
                        activity.status === 'CANCELED' ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      {activity.time} {activity.status}
                    </span>
                  </div>
                  <p className="text-gray-500">{activity.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Display activities by month */}
          {Object.entries(groupedActivities).map(([monthYear, days]) => (
            monthYear !== 'Today' && (
              <div key={monthYear} className="mb-6">
                {/* <h3 className="text-xl font-semibold mb-2">{monthYear}</h3> */}
                {Object.entries(days).map(([dayLabel, activities]) => (
                  <div key={dayLabel} className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 bg-slate-700 text-white p-2">{dayLabel}</h4>
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        onClick={() => handleClick(activity)}
                        className={`cursor-pointer bg-white p-4 mb-4 border-l-4 ${
                          activity.status === 'CANCELED' ? 'border-red-500' : 'border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold">{activity.amount}</span>
                          <span
                            className={`text-sm ${
                              activity.status === 'CANCELED' ? 'text-red-500' : 'text-gray-500'
                            }`}
                          >
                            {activity.time} {activity.status}
                          </span>
                        </div>
                        <p className="text-gray-500">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Details Section */}
      {selectedActivity && (
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-semibold mb-4">Details</h2>
          <div className="bg-gray-100 p-4 mb-4">
            <div className="flex justify-between mb-4">
              <div>
                <p>
                  <span className="font-semibold">Receipt Number:</span> {selectedActivity.receiptNumber}
                </p>
                <p>
                  <span className="font-semibold">Payment Method:</span> {selectedActivity.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Time of Transaction:</span> {selectedActivity.transactionTime}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setShowSendReceiptModal(true)}
                  className="py-2 px-4 border border-red-500 text-red-500 rounded"
                >
                  Send Receipt
                </button>
                <button
                  onClick={() => setShowRefundModal(true)}
                  className={`py-2 px-4 rounded ${selectedActivity.status === 'CANCELED' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'border border-blue-500 text-blue-500'}`}
                  disabled={selectedStatus === 'CANCELED'}
                >
                  Refund Request
                </button>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Items</h3>
            <div>
              {selectedActivity.items.map((item, index) => (
                <div key={index} className="flex bg-gray-300 justify-between items-center mb-4 p-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-200 p-1 rounded">{item.code}</span>
                    <span>{item.name}</span>
                  </div>
                  <span>{item.quantity}x</span>
                  <span>{item.product_price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold mb-2">
              <span>Sub Total:</span>
              <span>{selectedActivity.subTotal}</span>
            </div>
            <div className="flex justify-between font-semibold mb-2">
              <span>PPN (10%):</span>
              <span>{selectedActivity.tax}</span>
            </div>
            <div className="flex justify-between font-semibold mb-2">
              <span>Total:</span>
              <span>{selectedActivity.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal show={showRefundModal} onClose={() => setShowRefundModal(false)}>
        <RefundTransaction
          onClose={() => setShowRefundModal(false)}
          transaction={selectedActivity}
        />
      </Modal>

      <SendReceiptModal
        show={showSendReceiptModal}
        onClose={() => setShowSendReceiptModal(false)}
        transaction={selectedActivity}
      />
    </div>
  );
};

export default Page;
