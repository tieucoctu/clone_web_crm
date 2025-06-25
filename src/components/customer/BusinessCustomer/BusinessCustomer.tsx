import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { createBusinessLead, updateBusinessLead } from '../../api/leadsApi';
import type { BusinessLead } from '../../api/leadsApi';
import AppHeader from '../../Header/Header';
import Breadcrumb from '../../Breadcrumb/Breadcrumb';
import './BusinessCustomer.scss';

import CustomerTable from '../CustomerTable/CustomerTable';
import CustomerForm from '../CustomerForm/CustomerForm';

const BusinessCustomer = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<BusinessLead | null>(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createBusinessLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      message.success('Thêm thành công!');
      setOpenForm(false);
    },
    onError: () => message.error('Thêm thất bại'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BusinessLead }) => updateBusinessLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      message.success('Cập nhật thành công!');
      setOpenForm(false);
    },
    onError: () => message.error('Cập nhật thất bại'),
  });

  return (
    <div className="personal-customer-page-header">
      <div className="app-header">
        <AppHeader />
      </div>
      <div className="personal-customer-page">
        <div className="personal-customer-breadcrumb">
          <Breadcrumb />
        </div>

        <CustomerForm
          visible={openForm}
          onClose={() => {
            setOpenForm(false);
            setEditingCustomer(null);
          }}
          initialValues={editingCustomer || undefined}
          onSubmit={values => {
            if (editingCustomer) {
              updateMutation.mutate({ id: editingCustomer.id!, data: values });
            } else {
              createMutation.mutate(values);
            }
          }}
        />

        <CustomerTable
          onAddCustomerClick={() => {
            setEditingCustomer(null);
            setOpenForm(true);
          }}
          onEditCustomer={(customer: BusinessLead) => {
            setEditingCustomer(customer);
            setOpenForm(true);
          }}
          onViewCustomer={customer => {
            Modal.info({
              title: 'Chi tiết khách hàng',
              content: (
                <div>
                  <p>
                    <strong>Tên:</strong> {customer.name}
                  </p>
                  <p>
                    <strong>Người đại diện:</strong> {customer.representative}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {customer.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {customer.email}
                  </p>
                  <p>
                    <strong>Mã số thuế:</strong> {customer.taxCode}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {customer.status}
                  </p>
                  <p>
                    <strong>Nguồn:</strong> {customer.leadStatus}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong> {customer.createdAt}
                  </p>
                </div>
              ),
              onOk() {},
            });
          }}
        />
      </div>
    </div>
  );
};

export default BusinessCustomer;
