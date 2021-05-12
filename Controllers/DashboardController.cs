using QLCT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QLCT.Controllers
{
    public class DashboardController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // GET: Dashboard
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult AjaxRevenue(int year)
        {
            List<decimal> dt = new List<decimal>();
            for (int i = 0; i < 12; i++)
            {
                dt.Add(Doanhthuthang(i + 1, year));
            }
            return Json(dt, JsonRequestBehavior.AllowGet);
        }
        public decimal Doanhthuthang(int month, int year)
        {
            var dt = (from b in db.Bills
                      where b.Date.Value.Month.Equals(month)
                      where b.Date.Value.Year.Equals(year)
                      select new Guarantee_DetailsBill_Bill_Cus_Staff {
                          Totalpay = (decimal)b.Totalpay }).ToList();
            decimal dtt5 = 0;
            foreach (var item in dt)
            {
                dtt5 += item.Totalpay;
            }
            return dtt5;
        }
    }
}