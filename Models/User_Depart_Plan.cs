using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QLCT.Models
{
    public class User_Depart_Plan
    {
        public int IdPlan { get; set; }
        public string NamePlan { get; set; }
        public string NameDepart { get; set; }
        public int IdDepart { get; set; }
        public string NameUser { get; set; }
        public int IdUser { get; set; }
        public string PlanContent { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int? Status { get; set; }
    }
}