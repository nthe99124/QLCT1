using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QLCT.Models
{
    public class CustomerPlus
    {
        public Customer Customer { get; set; }
        public DateTime EndDate { get; set; }
        public CustomerPlus()
        {

            if (Convert.ToInt32(Customer.TypeOfDebt) == 1)
            {
                EndDate = Convert.ToDateTime(Customer.StartDate).AddMonths(6);
            }
            else
            {
                EndDate = Convert.ToDateTime(Customer.StartDate).AddMonths(12);
            }
        }
        
    }
}