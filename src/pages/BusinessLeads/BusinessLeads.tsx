import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { message } from 'antd';
import { createBusinessLead } from '../../components/api/leadsApi';
import CustomerForm from '../../components/customer/CustomerForm/CustomerForm';
// import CustomerTable from '../../components/customer/CustomerTable/CustomerTable';
import type { BusinessLead } from '../../components/api/leadsApi';
import Interface from '../../components/interface/interfaceCustomer';

const BusinessLead = () => {
  const [openForm, setOpenForm] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newCustomer: BusinessLead) => createBusinessLead(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });

      setOpenForm(false);
      message.success('Thêm khách hàng thành công!');
    },
    onError: () => {
      message.error('Lỗi khi thêm khách hàng!');
    },
  });

  return (
    <div>
      <CustomerForm
        visible={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={values => mutation.mutate(values)}
      />
      <Interface />
      {/* <CustomerTable onAddCustomerClick={() => setOpenForm(true)} /> */}
    </div>
  );
};

export default BusinessLead;
