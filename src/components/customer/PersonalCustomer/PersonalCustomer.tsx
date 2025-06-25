import { useState } from 'react';
import CustomerTable from '../CustomerTable/CustomerTable';
import CustomerForm from '../CustomerForm/CustomerForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { createBusinessLead, updateBusinessLead } from '../../api/leadsApi';
import type { BusinessLead } from '../../api/leadsApi';
import AppHeader from '../../Header/Header';
import Breadcrumbb from '../../Breadcrumb/Breadcrumbb';
import './PersonalCustomer.scss';

const PersonalCustomer = () => {
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
          <Breadcrumbb />
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
                    <b>Tên:</b> {customer.name}
                  </p>
                  <p>
                    <b>Số điện thoại:</b> {customer.phone}
                  </p>
                  <p>
                    <b>Người đại diện:</b> {customer.representative}
                  </p>
                  <p>
                    <b>Email:</b> {customer.email}
                  </p>
                  <p>
                    <b>Mã số thuế:</b> {customer.taxCode}
                  </p>
                  <p>
                    <b>Trạng thái:</b> {customer.status}
                  </p>
                  <p>
                    <b>Nguồn:</b> {customer.leadStatus}
                  </p>
                  <p>
                    <b>Ngày tạo:</b> {customer.createdAt}
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

export default PersonalCustomer;
