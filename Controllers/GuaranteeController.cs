using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class GuaranteeController : Controller
    {
        // GET: Guarantee

        public QLCTDataContext db = new QLCTDataContext();
        // View
        public ActionResult Index()
        {
            var uid = Session["user"];
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            var list = from g in db.Guarantees
                       join de in db.DetailsBills on g.IdDetailsBill equals de.Id
                       join b in db.Bills on de.IdBill equals b.Id
                       join u in db.Users on b.IdUser equals u.Id
                       join c in db.Customers on b.IdCustormer equals c.Id
                       join p in db.Products on de.IdProduct equals p.Id
                       where b.IsDelete == false
                       select new Guarantee_DetailsBill_Bill_Cus_Staff
                       {
                           IdGuarantee = g.Id,
                           UrlGuarantee = g.UrlGuarantee,
                           IdBill = b.Id,
                           NameBill = b.NameBill,
                           IdUser = u.Id,
                           NameUser = u.Name,
                           NameCus = c.Name,
                           FileHD = b.UrlBill,
                           Date = Convert.ToDateTime(b.Date),
                           NameProduct = p.Name,
                           IdStaffGuarantee = b.IdStaffGuarantee,
                           Note = g.Note,
                           MonthOfGuarantee = Convert.ToInt32(p.MonthOfGuarantee)
                       };
            return View(list);
        }
        public ActionResult ShowGuarantee(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                ViewBag.notify = "Bạn không có quyền truy cập";
            }
            var Guarantee = db.Guarantees.First(b => b.Id == id);
            ViewBag.UrlGuarantee = Guarantee.UrlGuarantee;
            return View();
        }
    }
}