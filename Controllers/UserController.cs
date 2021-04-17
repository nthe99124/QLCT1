using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class UserController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // GET: User
        // View
        public ActionResult Index()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            else
            {
                if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
                {
                    
                    return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
                }
                ViewBag.list = from u in db.Users
                               join d in db.Departments on u.IdDepartment equals d.Id
                               where u.IsDeleted == false
                               where d.IsDeleted == false
                               orderby u.Name descending
                               select new UserDepart
                               {
                                   NameUser = u.Name,
                                   NameDepart = d.Name,
                                   UserName = u.UserName,
                               };
            }
            return View();

        }
        public ActionResult IndexDevision()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            else
            {
                if (Session["user"] != "PGD" && Session["user"] != "PNS")
                {
                    ViewBag.notify = "Bạn không có quyền truy cập";
                }
                ViewBag.list = from d in db.Departments
                               where d.IsDeleted == false
                               orderby d.Name descending
                               select d;
            }
            return View();

        }
        //Search View
        //[HttpPost]
        //public ActionResult Index(int? page)
        //{

        //    var search = " FROM(SELECT * FROM Cutomer WHERE Status = 1 AND IsDeleted = 0 ";


        //}
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            ViewBag.IdDepartment = from u in db.Users 
                                   join d in db.Departments on u.IdDepartment equals d.Id
                                   select new { d.Name, u.IdDepartment };
            return View();
        }
        [HttpPost]
        public ActionResult Insert(User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var checkuser = db.Users.Where(u => u.Phone == Request["Phone"]).FirstOrDefault();
            if (checkuser == null)
            {
                user.UserName = Request["UserName"];
                user.PassWord = Request["PassWord"];
                user.Sex = Convert.ToBoolean(Request["Sex"]);
                user.Phone = Request["Phone"];
                user.IdDepartment = Convert.ToInt32(Request["IdDepartment"]);
                user.Status = Convert.ToInt32(Request["Status"]);
                user.IsDeleted = false;
                db.Users.InsertOnSubmit(user);
                // tang sl nhan vien
                var increaseDepart = db.Departments.Where(d => d.Id == Convert.ToInt32(Request["IdDepartment"])).FirstOrDefault();
                increaseDepart.NumberStaff += 1;
                UpdateModel(increaseDepart);
                db.SubmitChanges();
            }
            else
            {
                ViewBag.check = "Nhân sự đã tồn tại";
            }
            return this.Insert();
        }
        // Update
        public ActionResult Update(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var user = db.Users.First(u => u.Id == id);
            return View(user);
        }
        [HttpPost]
        public ActionResult Update(int id, User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            user = db.Users.Where(u => u.Id == id).SingleOrDefault();
            user.UserName = Request["UserName"];
            user.PassWord = Request["PassWord"];
            user.Name = Request["Name"];
            user.Sex = Convert.ToBoolean(Request["Sex"]);
            user.Phone = Request["Phone"];
            user.IdDepartment = Convert.ToInt32(Request["IdDepartment"]);
            user.Status = Convert.ToInt32(Request["Status"]);
            UpdateModel(user);
            db.SubmitChanges();
            return this.Update(id);
        }
        // Delete -- Update IsDelete
        public ActionResult Delete(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public ActionResult Delete(int id, User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            user = db.Users.Where(u => u.Id == id).SingleOrDefault();
            user.IsDeleted = true;
            UpdateModel(user);
            db.SubmitChanges();
            return this.Delete(id);
        }
    }
}