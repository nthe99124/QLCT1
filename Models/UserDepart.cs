using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QLCT.Models
{
    public class UserDepart
    {
        public string UserName { get; set; }
        public string NameDepart { get; set; }
        public int IdDepart { get; set; }
        public int IdUser { get; set; }
        public int? NumberStaff { get; set; }
        public int? IdHeader { get; set; }
        public bool IsDeletedDepart { get; set; }
        public string PassWord { get; set; }
        public string NameUser { get; set; }
        public bool Sex { get; set; }
        public string Phone { get; set; }
        public long NumberCus { get; set; }
        public int MyProperty { get; set; }
        public int? Status { get; set; }
        public bool IsDeleteUser { get; set; }

    }
}