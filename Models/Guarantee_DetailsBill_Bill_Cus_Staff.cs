using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QLCT.Models
{
    public class Guarantee_DetailsBill_Bill_Cus_Staff: User_DetailsBill_Cus_Bill_Product
    {
        public int IdGuarantee { get; set; }
        public string UrlGuarantee { get; set; }
        public string Note { get; set; }
        public bool Status { get; set; }
    }
}