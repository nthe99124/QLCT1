using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QLCT.Models
{
    public class User_DetailsBill_Cus_Bill_Product
    {
        public int IdBill { get; set; }
        public int? IdUser { get; set; }
        public string NameUser { get; set; }
        public string NameBill { get; set; }
        public int IdProduct { get; set; }
        public string NameProduct { get; set; }
        public DateTime Date { get; set; }
        public int? IdCus { get; set; }
        public string NameCus { get; set; }
        public string FileHD { get; set; }
        public int TypeOfBill { get; set; }
        public string SDTKH { get; set; }
        public string SL { get; set; }
        public int IdPro { get; set; }
        public float Gia { get; set; }
        public float GiamGia { get; set; }
        public int? IdStaffGuarantee { get; set; }
        public decimal Totalpay { get; set; }
        public decimal? Deposit { get; set; }
        public int TypeOfDebt { get; set; }
        public decimal? Debt { get; set; }
        public int MonthOfGuarantee { get; set; }
        public int? Status { get; set; }

        public int? IdCustormer { get; set; }
        public string AddDelivery { get; set; }

        public Product pro { get; set; }

    }
}